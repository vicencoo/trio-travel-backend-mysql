// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const imageStorage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     try {
//       let imageFolder = 'images';

//       if (file.fieldname === 'property_images') imageFolder = 'property_images';
//       if (file.fieldname === 'ticket_images') imageFolder = 'ticket_images';
//       if (file.fieldname === 'package_images') imageFolder = 'package_images';
//       if (file.fieldname === 'destination_images')
//         imageFolder = 'destination_images';

//       const folderPath = path.join(__dirname, '..', 'images', imageFolder);

//       if (!fs.existsSync(folderPath))
//         fs.mkdirSync(folderPath, { recursive: true });

//       cb(null, folderPath);
//     } catch (err) {
//       cb(err);
//     }
//   },
//   filename: (req, file, cb) => {
//     const cleanName = file.originalname.replace(/\s+/g, '-');
//     cb(null, `${Date.now()}-${cleanName}`);
//   },
// });

// const imageFileFilter = (req, file, cb) => {
//   const allowedExtensions = /jpeg|jpg|png|jfif|webp|avif/;
//   const isValidExtension = allowedExtensions.test(
//     path.extname(file.originalname).toLowerCase(),
//   );
//   const isValidMimeType = allowedExtensions.test(file.mimetype);

//   if (isValidExtension && isValidMimeType) cb(null, true);
//   else cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
// };

// const upload = multer({ storage: imageStorage, fileFilter: imageFileFilter });

// module.exports = upload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// ─── Config ───────────────────────────────────────────────────────────────────

const UPLOAD_ROOT = path.join(__dirname, '..', 'images');

const FIELD_CONFIG = {
  property_images: { width: 1200, quality: 80 },
  package_images: { width: 1200, quality: 80 },
  destination_images: { width: 900, quality: 80 },
  ticket_images: { width: 900, quality: 80 },
  default: { width: 900, quality: 80 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const sanitizeFilename = (original) =>
  original
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/\.[^.]+$/, '');

// ─── Sharp processor ──────────────────────────────────────────────────────────

const processFile = async (file) => {
  const config = FIELD_CONFIG[file.fieldname] ?? FIELD_CONFIG.default;
  const folder = file.fieldname in FIELD_CONFIG ? file.fieldname : 'images';
  const folderPath = path.join(UPLOAD_ROOT, folder);

  ensureDir(folderPath);

  const filename = `${Date.now()}-${sanitizeFilename(file.originalname)}.webp`;
  const outputPath = path.join(folderPath, filename);

  await sharp(file.buffer)
    .resize(config.width, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: config.quality, effort: 5 })
    .toFile(outputPath);

  return { filename, outputPath, folderPath };
};

// ─── Multer ───────────────────────────────────────────────────────────────────

const ALLOWED_EXT = /\.(jpe?g|png|jfif|webp|avif)$/i;
const ALLOWED_MIME = /^image\/(jpeg|png|webp|avif)$/;

const imageFileFilter = (_req, file, cb) => {
  const validExt = ALLOWED_EXT.test(path.extname(file.originalname));
  const validMime = ALLOWED_MIME.test(file.mimetype);
  if (validExt && validMime) cb(null, true);
  else cb(new Error('Only JPEG, PNG, WEBP, and AVIF images are allowed'));
};

const upload = multer({
  storage: multer.memoryStorage(), // buffer in memory → sharp processes → then saves
  fileFilter: imageFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

// ─── processImages middleware ─────────────────────────────────────────────────

const processImages = async (req, _res, next) => {
  try {
    const files = req.files
      ? Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat()
      : req.file
        ? [req.file]
        : [];

    if (!files.length) return next();

    await Promise.all(
      files.map(async (file) => {
        const { filename, outputPath, folderPath } = await processFile(file);

        file.filename = filename;
        file.path = outputPath;
        file.destination = folderPath;
        file.mimetype = 'image/webp';
        file.buffer = undefined;
      }),
    );

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, processImages };
