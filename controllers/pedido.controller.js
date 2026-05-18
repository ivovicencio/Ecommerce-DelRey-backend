const { sequelize, Pedido, DetallePedido, StockTalle } = require('../database'); //esto es para usar transacciones y modelos
const pedidoCtrl = {}; // Controlador para manejar pedidos

pedidoCtrl.createPedido = async (req, res) => {
    try {
        const codigoRandom = Math.floor(1000 + Math.random() * 9000); // Genera un código aleatorio de 4 dígitos para el pedido
        
        const nuevoPedido = await Pedido.create({
            codigo: `#DELREY-${codigoRandom}`, // Asigna el código generado al pedido
            total: req.body.total,
            items: req.body.items 
        }, {
            include: [{ model: DetallePedido, as: 'items' }]
        });
        // El bloque anterior crea un nuevo pedido con el código generado, el total y los items del pedido. La opción "include" se utiliza para crear también los detalles del pedido (items) asociados al pedido principal.
        res.json({ status: '1', codigo: nuevoPedido.codigo });
    } catch (error) {
        res.status(400).json({ status: '0', msg: 'Error armando el pedido.' });
    }
};

pedidoCtrl.confirmarPedido = async (req, res) => {
    const t = await sequelize.transaction(); // Inicia una transacción para asegurar que todas las operaciones se completen correctamente
    try {
        const pedido = await Pedido.findByPk(req.params.id, { 
            include: [{ model: DetallePedido, as: 'items' }] 
        }); // Busca el pedido por su ID e incluye los detalles del pedido (items)
        
        //si el pedido ya está completado, no se puede procesar nuevamente
        if (pedido.estado === 'Completado') {
            return res.status(400).json({ status: '0', msg: 'Ya procesado.' });
        }

        //despues de confirmar el pedido, se actualiza el stock de cada producto según la cantidad pedida
        for (let item of pedido.items) {
            const stockItem = await StockTalle.findOne({
                where: { producto_id: item.producto_id, numero_talle: item.talle },
                transaction: t
            });//toda esta linea busca el stock del producto específico y talle específico para el item del pedido, y se hace dentro de la transacción para asegurar que si algo falla, se pueda revertir todo el proceso.

            //si no hay suficiente stock para el producto, se lanza un error y se revierte la transacción
            if (stockItem.stock < item.cantidad) throw new Error(`Sin stock suficiente.`);
            await stockItem.decrement('stock', { by: item.cantidad, transaction: t });
        }

        //si todo sale bien, se actualiza el estado del pedido a "Completado" y se confirma la transacción
        await pedido.update({ estado: 'Completado' }, { transaction: t });
        await t.commit();
        res.json({ status: '1', msg: 'Stock actualizado con éxito.' });
    } catch (error) {
        //si ocurre algún error durante el proceso, se revierte la transacción para asegurar que no se realicen cambios parciales en la base de datos
        await t.rollback();
        res.status(400).json({ status: '0', msg: error.message });
    }
};

//aca solamente para cancelar el pedido sin afectar el stock, ya que el pedido no se ha confirmado ni se ha descontado el stock, por lo que simplemente se actualiza el estado del pedido a "Cancelado" sin necesidad de realizar ninguna operación adicional en la base de datos.
pedidoCtrl.cancelarPedido = async (req, res) => {
    try {
        await Pedido.update({ estado: 'Cancelado' }, { where: { id: req.params.id } });
        res.json({ status: '1', msg: 'Pedido cancelado.' });
    } catch (error) {
        res.status(400).json({ status: '0', msg: 'Error al cancelar.' });
    }
};

module.exports = pedidoCtrl;