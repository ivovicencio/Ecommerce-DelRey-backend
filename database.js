const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

//esto es para conectarnos a la base de datos, se le pasan los datos de la base de datos que tenemos en el .env
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
);

const Usuario = sequelize.define('Usuario', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.STRING, defaultValue: 'cliente' }
}, { timestamps: false });

const Producto = sequelize.define('Producto', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  categoria: { type: DataTypes.STRING, allowNull: false },
  imagen_url: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: false });

const StockTalle = sequelize.define('StockTalle', {
  numero_talle: { type: DataTypes.INTEGER, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { timestamps: false });

const Pedido = sequelize.define('Pedido', {
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  estado: { type: DataTypes.STRING, defaultValue: 'Pendiente' },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: false });

const DetallePedido = sequelize.define('DetallePedido', {
  talle: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { timestamps: false });

//relaciones entre las tablas, esto es para que sequelize sepa como relacionar los modelos entre si, por ejemplo un producto puede tener muchos talles y un talle pertenece a un producto, lo mismo con los pedidos y los detalles de pedido
Producto.hasMany(StockTalle, { as: 'talles', foreignKey: 'producto_id', onDelete: 'CASCADE' });
StockTalle.belongsTo(Producto, { foreignKey: 'producto_id' });

Pedido.hasMany(DetallePedido, { as: 'items', foreignKey: 'pedido_id', onDelete: 'CASCADE' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Producto.hasMany(DetallePedido, { foreignKey: 'producto_id' });
DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' });

//esto es para sincronizar los modelos con la base de datos, esto crea las tablas en la base de datos si no existen, y actualiza las tablas si los modelos cambian
module.exports = {sequelize, Usuario, Producto, StockTalle, Pedido, DetallePedido};