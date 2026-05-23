const bcrypt = require('bcryptjs');
const { sequelize, Usuario } = require('../database');

async function seed() {
  await sequelize.sync({ alter: true });

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@delrey.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const adminNombre = process.env.ADMIN_NOMBRE || 'Admin';

  const existe = await Usuario.findOne({ where: { email: adminEmail } });

  if (existe) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPass, salt);
    existe.password = hash;
    existe.nombre = adminNombre;
    await existe.save();
    console.log('Admin actualizado:', adminEmail);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPass, salt);
    await Usuario.create({ nombre: adminNombre, email: adminEmail, password: hash, rol: 'admin' });
    console.log('Admin creado:', adminEmail);
  }

  process.exit();
}

seed();
