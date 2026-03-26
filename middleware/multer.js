// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const sharp = require('sharp');

// // ─── Config ───────────────────────────────────────────────────────────────────

// const UPLOAD_ROOT = path.join(__dirname, '..', 'images');

// const FIELD_CONFIG = {
//   property_images: { width: 1200, quality: 80 },
//   package_images: { width: 1200, quality: 80 },
//   destination_images: { width: 900, quality: 80 },
//   ticket_images: { width: 900, quality: 80 },
//   default: { width: 900, quality: 80 },
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const ensureDir = (dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// };

// const sanitizeFilename = (original) =>
//   original
//     .replace(/\s+/g, '-')
//     .replace(/[^a-zA-Z0-9._-]/g, '')
//     .replace(/\.[^.]+$/, '');

// // ─── Sharp processor ──────────────────────────────────────────────────────────

// const processFile = async (file) => {
//   const config = FIELD_CONFIG[file.fieldname] ?? FIELD_CONFIG.default;
//   const folder = file.fieldname in FIELD_CONFIG ? file.fieldname : 'images';
//   const folderPath = path.join(UPLOAD_ROOT, folder);

//   ensureDir(folderPath);

//   const filename = `${Date.now()}-${sanitizeFilename(file.originalname)}.webp`;
//   const outputPath = path.join(folderPath, filename);

//   await sharp(file.buffer)
//     .resize(config.width, null, {
//       fit: 'inside',
//       withoutEnlargement: true,
//     })
//     .webp({ quality: config.quality, effort: 5 })
//     .toFile(outputPath);

//   return { filename, outputPath, folderPath };
// };

// // ─── Multer ───────────────────────────────────────────────────────────────────

// const ALLOWED_EXT = /\.(jpe?g|png|jfif|webp|avif)$/i;
// const ALLOWED_MIME = /^image\/(jpeg|png|webp|avif)$/;

// const imageFileFilter = (_req, file, cb) => {
//   const validExt = ALLOWED_EXT.test(path.extname(file.originalname));
//   const validMime = ALLOWED_MIME.test(file.mimetype);
//   if (validExt && validMime) cb(null, true);
//   else cb(new Error('Only JPEG, PNG, WEBP, and AVIF images are allowed'));
// };

// const upload = multer({
//   storage: multer.memoryStorage(), // buffer in memory → sharp processes → then saves
//   fileFilter: imageFileFilter,
//   limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
// });

// // ─── processImages middleware ─────────────────────────────────────────────────

// const processImages = async (req, _res, next) => {
//   try {
//     const files = req.files
//       ? Array.isArray(req.files)
//         ? req.files
//         : Object.values(req.files).flat()
//       : req.file
//         ? [req.file]
//         : [];

//     if (!files.length) return next();

//     await Promise.all(
//       files.map(async (file) => {
//         const { filename, outputPath, folderPath } = await processFile(file);

//         file.filename = filename;
//         file.path = outputPath;
//         file.destination = folderPath;
//         file.mimetype = 'image/webp';
//         file.buffer = undefined;
//       }),
//     );

//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { upload, processImages };

// With Cloudinary
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const cloudinary = require('./cloudinary');

// ─── Config ───────────────────────────────────────────────────────────────────

const FIELD_CONFIG = {
  property_images: {
    width: 1200,
    quality: 80,
    folder: 'trio-travel/property_images',
  },
  package_images: {
    width: 1200,
    quality: 80,
    folder: 'trio-travel/package_images',
  },
  destination_images: {
    width: 900,
    quality: 80,
    folder: 'trio-travel/destination_images',
  },
  ticket_images: {
    width: 900,
    quality: 80,
    folder: 'trio-travel/ticket_images',
  },
  default: { width: 900, quality: 80, folder: 'trio-travel/images' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sanitizeFilename = (original) =>
  original
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/\.[^.]+$/, '');

const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(buffer);
  });

// ─── Sharp processor + Cloudinary upload ──────────────────────────────────────

const processFile = async (file) => {
  const config = FIELD_CONFIG[file.fieldname] ?? FIELD_CONFIG.default;

  const filename = `${Date.now()}-${sanitizeFilename(file.originalname)}`;

  const processedBuffer = await sharp(file.buffer)
    .resize(config.width, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: config.quality, effort: 5 })
    .toBuffer();

  const result = await uploadBufferToCloudinary(processedBuffer, {
    folder: config.folder,
    public_id: filename,
    format: 'webp',
  });

  return {
    filename: `${filename}.webp`,
    url: result.secure_url,
    public_id: result.public_id,
    bytes: result.bytes,
    format: result.format,
  };
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
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
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
        const uploaded = await processFile(file);

        file.filename = uploaded.filename;
        file.path = uploaded.url; // Cloudinary URL
        file.mimetype = 'image/webp';
        file.buffer = undefined;

        // extra fields you will use in controllers
        file.cloudinaryUrl = uploaded.url;
        file.cloudinaryPublicId = uploaded.public_id;
        file.cloudinaryBytes = uploaded.bytes;
        file.cloudinaryFormat = uploaded.format;
      }),
    );

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, processImages };
