const { Pedido, DetallePedido, Producto } = require('../database');
const { Op } = require('sequelize');
const pedidoCtrl = {};

pedidoCtrl.createPedido = async (req, res) => {
    try {
        const codigoRandom = Math.floor(1000 + Math.random() * 9000);

        const nuevoPedido = await Pedido.create({
            codigo: `#DELREY-${codigoRandom}`,
            cliente_nombre: req.body.cliente_nombre,
            cliente_direccion: req.body.cliente_direccion,
            total: req.body.total,
            items: req.body.items
        }, {
            include: [{ model: DetallePedido, as: 'items' }]
        });

        res.json({ status: '1', codigo: nuevoPedido.codigo });
    } catch (error) {
        console.error('Error armando el pedido:', error);
        res.status(400).json({ status: '0', msg: 'Error armando el pedido.', details: error.message });
    }
};

pedidoCtrl.getPedidos = async (req, res) => {
    try {
        const { estado } = req.query;
        const where = {};
        if (estado && estado !== 'todos') where.estado = estado;

        const pedidos = await Pedido.findAll({
            where,
            include: [{ model: DetallePedido, as: 'items' }],
            order: [['fecha', 'DESC']]
        });
        res.json(pedidos);
    } catch (error) {
        console.error('Error al listar pedidos:', error);
        res.status(500).json({ status: '0', msg: 'Error al listar pedidos.', details: error.message });
    }
};

pedidoCtrl.getPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [{ model: DetallePedido, as: 'items' }]
        });
        if (!pedido) return res.status(404).json({ status: '0', msg: 'Pedido no encontrado.' });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ status: '0', msg: 'Error del servidor.' });
    }
};

pedidoCtrl.confirmarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) return res.status(404).json({ status: '0', msg: 'Pedido no encontrado.' });
        if (pedido.estado === 'Completado') return res.status(400).json({ status: '0', msg: 'Ya procesado.' });

        await pedido.update({ estado: 'Completado' });
        res.json({ status: '1', msg: 'Pedido confirmado.' });
    } catch (error) {
        console.error('Error confirmando pedido:', error);
        res.status(400).json({ status: '0', msg: error.message });
    }
};

pedidoCtrl.cancelarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) return res.status(404).json({ status: '0', msg: 'Pedido no encontrado.' });

        await pedido.update({ estado: 'Cancelado' });
        res.json({ status: '1', msg: 'Pedido cancelado.' });
    } catch (error) {
        console.error('Error al cancelar:', error);
        res.status(400).json({ status: '0', msg: 'Error al cancelar.', details: error.message });
    }
};

pedidoCtrl.getResumen = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{ model: DetallePedido, as: 'items' }]
        });

        const totalIngresos = pedidos
            .filter(p => p.estado === 'Completado')
            .reduce((sum, p) => sum + Number(p.total), 0);

        const resumen = {
            totalPedidos: pedidos.length,
            pendientes: pedidos.filter(p => p.estado === 'Pendiente').length,
            completados: pedidos.filter(p => p.estado === 'Completado').length,
            cancelados: pedidos.filter(p => p.estado === 'Cancelado').length,
            totalIngresos,
            pedidos
        };

        res.json(resumen);
    } catch (error) {
        console.error('Error al obtener resumen:', error);
        res.status(500).json({ status: '0', msg: 'Error al obtener resumen.', details: error.message });
    }
};

module.exports = pedidoCtrl;
