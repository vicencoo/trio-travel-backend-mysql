const path = require('path');
const fs = require('fs');

const clearImage = (file) => {
  let filePath;
  if (typeof file === 'string') {
    filePath = file;
  } else if (file && (file.url || file.path)) {
    filePath = file.url || file.path;
  } else {
    return console.log('Invalid file input for clearImage:', file);
  }

  const fullPath = path.join(__dirname, '..', filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  } else {
    console.error('File not found, skipping deletion:', fullPath);
  }
};

module.exports = clearImage;
