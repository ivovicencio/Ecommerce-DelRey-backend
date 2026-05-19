const bcrypt = require('bcryptjs');
const { sequelize, Usuario } = require('../database');
require('dotenv').config();

async function seed() {
  await sequelize.sync({ alter: true });

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@delrey.com';
  const existe = await Usuario.findOne({ where: { email: adminEmail } });

  if (!existe) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
    await Usuario.create({ nombre: 'Admin', email: adminEmail, password: hash, rol: 'admin' });
    console.log('Admin creado:', adminEmail);
  } else {
    console.log('Admin ya existe:', adminEmail);
  }

  process.exit();
}

seed();
