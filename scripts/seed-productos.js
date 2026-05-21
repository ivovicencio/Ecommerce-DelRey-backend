const { sequelize, Producto } = require('../database');
const productos = require('./productos-data');
require('dotenv').config();

async function seed() {
  await sequelize.sync();

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
