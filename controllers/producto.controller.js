const { Producto } = require('../database');
const productoCtrl = {};

productoCtrl.getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({ order: [['id', 'DESC']] });
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: '0', msg: 'Error al obtener productos.', details: error.message });
    }
};

productoCtrl.getProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ status: '0', msg: 'Producto no encontrado.' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ status: '0', msg: 'Error del servidor.' });
    }
};

productoCtrl.createProducto = async (req, res) => {
    try {
        const imageUrl = req.file ? (req.file.secure_url || req.file.url || '') : '';
        const tallesParseados = req.body.talles ? JSON.parse(req.body.talles) : [];

        await Producto.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            categoria: req.body.categoria,
            tipo: req.body.tipo || null,
            talles: tallesParseados,
            imagen_url: imageUrl
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

        const updateData = {
            nombre: req.body.nombre || producto.nombre,
            descripcion: req.body.descripcion || producto.descripcion,
            precio: req.body.precio || producto.precio,
            categoria: req.body.categoria || producto.categoria,
            imagen_url: imageUrl
        };

        if (req.body.tipo !== undefined) updateData.tipo = req.body.tipo;
        if (tallesParseados) updateData.talles = tallesParseados;

        await producto.update(updateData);

        res.json({ status: '1', msg: 'Producto actualizado.', producto });
    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(400).json({ status: '0', msg: 'Error actualizando producto.', details: error.message });
    }
};

productoCtrl.deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ status: '0', msg: 'Producto no encontrado.' });

        await producto.destroy();
        res.json({ status: '1', msg: 'Producto eliminado.' });
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(400).json({ status: '0', msg: 'Error eliminando producto.', details: error.message });
    }
};

module.exports = productoCtrl;
