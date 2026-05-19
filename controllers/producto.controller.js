const { Producto, StockTalle } = require('../database');
const productoCtrl = {};

productoCtrl.getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [{ model: StockTalle, as: 'talles' }],
            order: [['id', 'DESC']]
        });
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: '0', msg: 'Error al obtener productos.', details: error.message });
    }
};

productoCtrl.getProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id, {
            include: [{ model: StockTalle, as: 'talles' }]
        });
        if (!producto) return res.status(404).json({ status: '0', msg: 'Producto no encontrado.' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ status: '0', msg: 'Error del servidor.' });
    }
};

productoCtrl.createProducto = async (req, res) => {
    try {
        const imageUrl = req.file ? (req.file.secure_url || req.file.url || '') : '';
        const tallesParseados = JSON.parse(req.body.talles);

        await Producto.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            categoria: req.body.categoria,
            imagen_url: imageUrl,
            talles: tallesParseados
        }, {
            include: [{ model: StockTalle, as: 'talles' }]
        });

        res.json({ status: '1', msg: 'Producto creado.' });
    } catch (error) {
        console.error('Error guardando producto:', error);
        res.status(400).json({ status: '0', msg: 'Error guardando producto.', details: error.message });
    }
};

productoCtrl.updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ status: '0', msg: 'Producto no encontrado.' });

        const imageUrl = req.file ? (req.file.secure_url || req.file.url || '') : producto.imagen_url;
        const tallesParseados = req.body.talles ? JSON.parse(req.body.talles) : null;

        await producto.update({
            nombre: req.body.nombre || producto.nombre,
            descripcion: req.body.descripcion || producto.descripcion,
            precio: req.body.precio || producto.precio,
            categoria: req.body.categoria || producto.categoria,
            imagen_url: imageUrl
        });

        if (tallesParseados) {
            await StockTalle.destroy({ where: { producto_id: producto.id } });
            for (const t of tallesParseados) {
                await StockTalle.create({ producto_id: producto.id, numero_talle: t.numero_talle, stock: t.stock });
            }
        }

        const actualizado = await Producto.findByPk(producto.id, {
            include: [{ model: StockTalle, as: 'talles' }]
        });

        res.json({ status: '1', msg: 'Producto actualizado.', producto: actualizado });
    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(400).json({ status: '0', msg: 'Error actualizando producto.', details: error.message });
    }
};

productoCtrl.deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ status: '0', msg: 'Producto no encontrado.' });

        await StockTalle.destroy({ where: { producto_id: producto.id } });
        await producto.destroy();

        res.json({ status: '1', msg: 'Producto eliminado.' });
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(400).json({ status: '0', msg: 'Error eliminando producto.', details: error.message });
    }
};

module.exports = productoCtrl;
