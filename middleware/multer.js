const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let imageFolder = 'images';

      if (file.fieldname === 'property_images') imageFolder = 'property_images';
      if (file.fieldname === 'ticket_images') imageFolder = 'ticket_images';
      if (file.fieldname === 'package_images') imageFolder = 'package_images';
      if (file.fieldname === 'hotel_images') imageFolder = 'hotel_images';
      if (file.fieldname === 'destination_images')
        imageFolder = 'destination_images';

      const folderPath = path.join(__dirname, '..', 'images', imageFolder);

      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true });

      cb(null, folderPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|jfif|webp|avif/;
  const isValidExtension = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const isValidMimeType = allowedExtensions.test(file.mimetype);

  if (isValidExtension && isValidMimeType) cb(null, true);
  else cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
};

const upload = multer({ storage: imageStorage, fileFilter: imageFileFilter });

module.exports = upload;
