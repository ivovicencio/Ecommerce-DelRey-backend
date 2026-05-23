const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'delrey_secret_key_change_in_prod';

const authCtrl = {};

authCtrl.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ status: '0', msg: 'Todos los campos son obligatorios.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ status: '0', msg: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ status: '0', msg: 'El email ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      rol: 'cliente'
    });

    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      status: '1',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    console.error('Error register:', error);
    res.status(500).json({ status: '0', msg: 'Error al registrar.', details: error.message });
  }
};

authCtrl.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: '0', msg: 'Email y contraseña obligatorios.' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ status: '0', msg: 'Credenciales inválidas.' });
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(400).json({ status: '0', msg: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      status: '1',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ status: '0', msg: 'Error al iniciar sesión.', details: error.message });
  }
};

authCtrl.cambiarPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ status: '0', msg: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await Usuario.update({ password: hash }, { where: { id: req.usuario.id } });

    res.json({ status: '1', msg: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error cambiar password:', error);
    res.status(500).json({ status: '0', msg: 'Error al cambiar la contraseña.', details: error.message });
  }
};

authCtrl.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nombre', 'email', 'rol']
    });
    if (!usuario) {
      return res.status(404).json({ status: '0', msg: 'Usuario no encontrado.' });
    }
    res.json({ status: '1', usuario });
  } catch (error) {
    res.status(500).json({ status: '0', msg: 'Error del servidor.' });
  }
};

module.exports = authCtrl;
