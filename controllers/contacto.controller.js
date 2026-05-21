const { Resena } = require('../database');

exports.getResenas = async (req, res) => {
  try {
    const resenas = await Resena.findAll({
      order: [['fecha', 'DESC']],
      limit: 20
    });
    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ status: '0', msg: 'Error al obtener reseñas.' });
  }
};

exports.createResena = async (req, res) => {
  try {
    const { nombre, mensaje } = req.body;
    if (!nombre || !mensaje) {
      return res.status(400).json({ status: '0', msg: 'Nombre y mensaje son obligatorios.' });
    }
    await Resena.create({ nombre, mensaje });
    res.json({ status: '1', msg: 'Reseña enviada con éxito. ¡Gracias!' });
  } catch (error) {
    console.error('Error guardando reseña:', error);
    res.status(500).json({ status: '0', msg: 'Error al enviar la reseña.' });
  }
};
