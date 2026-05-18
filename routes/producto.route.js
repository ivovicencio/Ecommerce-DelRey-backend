const express = require('express');
const router = express.Router();
const productoCtrl = require('../controllers/producto.controller');
const upload = require('../middlewares/multer');

router.get('/', productoCtrl.getProductos);
router.post('/', upload.single('imagen'), productoCtrl.createProducto);

module.exports = router;