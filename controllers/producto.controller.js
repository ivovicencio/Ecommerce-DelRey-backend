const {Producto, StockTalle} = require('../database');
const productoCtrl = {};

productoCtrl.getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [{model: StockTalle, as: 'talles'}],
            order: [['id', 'DESC']]
        });
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: '0', msg: 'Error al obtener productos.', details: error.message });
    }
};

productoCtrl.createProducto = async (req, res) => {
    try {
        const imageUrl = req.file ? '/uploads/' + req.file.filename : '';
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

module.exports = productoCtrl;
