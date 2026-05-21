const { sequelize, Producto } = require('../database');
require('dotenv').config();

const productos = [
  {
    nombre: 'Bota Borcego Desmontable 2 en 1 Negro',
    descripcion: 'Borcego de cuero negro desmontable, ideal para el día a día. Cómodo y resistente.',
    precio: 64000,
    categoria: 'femenino',
    tipo: 'botas',
    talles: [34, 35, 36, 37, 38, 39, 40, 41, 42],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Bota Borcego Desmontable 2 en 1 Marrón',
    descripcion: 'Borcego de cuero marrón desmontable. Dos estilos en uno, perfecto para cualquier look.',
    precio: 64000,
    categoria: 'femenino',
    tipo: 'botas',
    talles: [34, 35, 36, 37, 38, 39, 40, 41, 42],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Texana Cuero Clásica Negra',
    descripcion: 'Texana de cuero genuino color negro. Estilo atemporal con suela antideslizante.',
    precio: 55000,
    categoria: 'femenino',
    tipo: 'urbano',
    talles: [35, 36, 37, 38, 39, 40, 41],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Zapatilla Deportiva Urbana Blanca',
    descripcion: 'Zapatilla deportiva blanca, cómoda para uso diario. Ideal para looks casuales.',
    precio: 48000,
    categoria: 'unisex',
    tipo: 'deportivo',
    talles: [36, 37, 38, 39, 40, 41, 42, 43, 44],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Botín de Cuero con Taco',
    descripcion: 'Botín de cuero con taco firme, ideal para la oficina o salidas. Elegante y cómodo.',
    precio: 72000,
    categoria: 'femenino',
    tipo: 'formal',
    talles: [35, 36, 37, 38, 39, 40],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Bota de Cuero Unisex Clásica',
    descripcion: 'Bota clásica de cuero, resistente para el frío. Ideal para el invierno.',
    precio: 78000,
    categoria: 'unisex',
    tipo: 'botas',
    talles: [36, 37, 38, 39, 40, 41, 42, 43],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Zapatilla Urbana Hombre Negra',
    descripcion: 'Zapatilla urbana negra para hombre. Diseño moderno y suela amortiguada.',
    precio: 52000,
    categoria: 'masculino',
    tipo: 'urbano',
    talles: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Borcego Hombre Cuero Marrón',
    descripcion: 'Borcego de cuero marrón para hombre. Resistente y con estilo rústico.',
    precio: 68000,
    categoria: 'masculino',
    tipo: 'botas',
    talles: [38, 39, 40, 41, 42, 43, 44, 45],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Bota Texana Unisex Marrón',
    descripcion: 'Bota texana de cuero marrón, estilo clásico. Cómoda y duradera.',
    precio: 60000,
    categoria: 'unisex',
    tipo: 'urbano',
    talles: [36, 37, 38, 39, 40, 41, 42, 43],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Sandalia Cuero Mujer Marrón',
    descripcion: 'Sandalia de cuero marrón para mujer. Fresca, cómoda y elegante para el verano.',
    precio: 38000,
    categoria: 'femenino',
    tipo: 'urbano',
    talles: [35, 36, 37, 38, 39, 40],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Zapatilla Deportiva Hombre Azul',
    descripcion: 'Zapatilla deportiva azul para hombre. Ideal para uso diario con gran comodidad.',
    precio: 50000,
    categoria: 'masculino',
    tipo: 'deportivo',
    talles: [38, 39, 40, 41, 42, 43, 44, 45],
    imagen_url: 'assets/images/logo.png'
  },
  {
    nombre: 'Zapato Formal Hombre Negro',
    descripcion: 'Zapato formal de vestir negro. Perfecto para eventos y oficina.',
    precio: 62000,
    categoria: 'masculino',
    tipo: 'formal',
    talles: [38, 39, 40, 41, 42, 43, 44],
    imagen_url: 'assets/images/logo.png'
  },
];

async function seed() {
  await sequelize.sync({ alter: true });

  const count = await Producto.count();
  if (count > 0) {
    console.log(`Ya existen ${count} productos. No se agregan duplicados.`);
    process.exit();
  }

  for (const p of productos) {
    await Producto.create(p);
    console.log(`Creado: ${p.nombre}`);
  }

  console.log(`\n${productos.length} productos creados exitosamente.`);
  process.exit();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
