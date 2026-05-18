const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'delrey_secret_key_change_in_prod';

const verificarToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ status: '0', msg: 'Acceso denegado. Token requerido.' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: '0', msg: 'Token inválido o expirado.' });
  }
};

const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ status: '0', msg: 'Acceso denegado. Se requiere rol de administrador.' });
};

module.exports = { verificarToken, esAdmin };
