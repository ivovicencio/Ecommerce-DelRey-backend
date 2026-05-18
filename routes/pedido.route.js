const express = require('express');
const router = express.Router();
const pedidoCtrl = require('../controllers/pedido.controller');

router.post('/', pedidoCtrl.createPedido);
router.put('/:id/confirmar', pedidoCtrl.confirmarPedido);
router.put('/:id/cancelar', pedidoCtrl.cancelarPedido);

module.exports = router;