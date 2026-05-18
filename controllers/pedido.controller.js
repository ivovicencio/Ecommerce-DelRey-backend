const { sequelize, Pedido, DetallePedido, StockTalle } = require('../database');
const pedidoCtrl = {};

pedidoCtrl.createPedido = async (req, res) => {
    try {
        const codigoRandom = Math.floor(1000 + Math.random() * 9000);

        const nuevoPedido = await Pedido.create({
            codigo: `#DELREY-${codigoRandom}`,
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

pedidoCtrl.confirmarPedido = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [{ model: DetallePedido, as: 'items' }]
        });

        if (!pedido) {
            await t.rollback();
            return res.status(404).json({ status: '0', msg: 'Pedido no encontrado.' });
        }

        if (pedido.estado === 'Completado') {
            await t.rollback();
            return res.status(400).json({ status: '0', msg: 'Ya procesado.' });
        }

        for (let item of pedido.items) {
            const stockItem = await StockTalle.findOne({
                where: { producto_id: item.producto_id, numero_talle: item.talle },
                transaction: t
            });

            if (!stockItem) {
                await t.rollback();
                return res.status(400).json({ status: '0', msg: `Stock no encontrado para talle ${item.talle}.` });
            }

            if (stockItem.stock < item.cantidad) {
                await t.rollback();
                return res.status(400).json({ status: '0', msg: `Sin stock suficiente para talle ${item.talle}.` });
            }

            await stockItem.decrement('stock', { by: item.cantidad, transaction: t });
        }

        await pedido.update({ estado: 'Completado' }, { transaction: t });
        await t.commit();
        res.json({ status: '1', msg: 'Stock actualizado con éxito.' });
    } catch (error) {
        await t.rollback();
        console.error('Error confirmando pedido:', error);
        res.status(400).json({ status: '0', msg: error.message });
    }
};

pedidoCtrl.cancelarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ status: '0', msg: 'Pedido no encontrado.' });
        }
        await pedido.update({ estado: 'Cancelado' });
        res.json({ status: '1', msg: 'Pedido cancelado.' });
    } catch (error) {
        console.error('Error al cancelar:', error);
        res.status(400).json({ status: '0', msg: 'Error al cancelar.', details: error.message });
    }
};

module.exports = pedidoCtrl;
