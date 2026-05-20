const express = require('express');
const router = express.Router();
const pedidoCtrl = require('../controllers/pedido.controller');
const { verificarToken, esAdmin } = require('../middlewares/auth');

router.post('/', pedidoCtrl.createPedido);
router.get('/', verificarToken, esAdmin, pedidoCtrl.getPedidos);
router.get('/resumen', verificarToken, esAdmin, pedidoCtrl.getResumen);
router.get('/:id', verificarToken, esAdmin, pedidoCtrl.getPedido);
router.put('/:id/confirmar', verificarToken, esAdmin, pedidoCtrl.confirmarPedido);
router.put('/:id/cancelar', verificarToken, esAdmin, pedidoCtrl.cancelarPedido);

module.exports = router;
