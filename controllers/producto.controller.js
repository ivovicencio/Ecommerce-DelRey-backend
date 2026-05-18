const {Producto, StockTalle} = require('../database');
const productoCtrl = {};

// Obtener todos los productos con sus talles
productoCtrl.getProductos = async (req, res) => {
    const productos = await Producto.findAll({
        include: [{model: StockTalle, as: 'talles'}]
    });
    res.json(productos);
};

//crear el producto
productoCtrl.createProducto = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : ''; // Obtener la URL de la imagen si se ha subido un archivo
        const tallesParseados = JSON.parse(req.body.talles); // Parsear los talles desde el cuerpo de la solicitud

        // Crear el producto con los talles asociados
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
        res.status(400).json({ status: '0', msg: 'Error guardando producto.' });
    }
};

module.exports = productoCtrl;