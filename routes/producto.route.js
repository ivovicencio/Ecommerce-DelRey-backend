const express = require('express');
const router = express.Router();
const productoCtrl = require('../controllers/producto.controller');
const upload = require('../middlewares/multer');
const { verificarToken, esAdmin } = require('../middlewares/auth');

router.get('/', productoCtrl.getProductos);
router.get('/:id', productoCtrl.getProducto);
router.post('/', verificarToken, esAdmin, upload.single('imagen'), productoCtrl.createProducto);
router.put('/:id', verificarToken, esAdmin, upload.single('imagen'), productoCtrl.updateProducto);
router.delete('/:id', verificarToken, esAdmin, productoCtrl.deleteProducto);

module.exports = router;
