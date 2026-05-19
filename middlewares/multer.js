const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'del_rey_catalogo', allowedFormats: ['jpg', 'png', 'jpeg', 'webp'] },
});

module.exports = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
