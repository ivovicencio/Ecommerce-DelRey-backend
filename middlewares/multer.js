const multer = require('multer'); // Multer es un middleware para manejar multipart/form-data, que se utiliza principalmente para subir archivos.
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // CloudinaryStorage es un motor de almacenamiento para Multer que sube archivos directamente a Cloudinary.
const cloudinary = require('cloudinary').v2; // Cloudinary es un servicio de gestión de imágenes y videos en la nube. Aquí se importa la versión 2 de su SDK.
require('dotenv').config();

// Configuración de Cloudinary con las credenciales almacenadas en variables de entorno.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de Multer para usar CloudinaryStorage. Se especifica la carpeta donde se almacenarán las imágenes y los formatos permitidos.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'del_rey_catalogo', allowedFormats: ['jpg', 'png', 'jpeg', 'webp'] },
});

module.exports = multer({ storage: storage });