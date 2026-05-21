const { Router } = require('express');
const { Contador } = require('../database');

const router = Router();

router.get('/:nombre', async (req, res) => {
  try {
    const c = await Contador.findOne({ where: { nombre: req.params.nombre } });
    res.json({ nombre: req.params.nombre, valor: c ? c.valor : 0 });
  } catch (e) {
    res.status(500).json({ msg: 'Error al leer contador' });
  }
});

router.post('/:nombre/incrementar', async (req, res) => {
  try {
    const [c] = await Contador.findOrCreate({
      where: { nombre: req.params.nombre },
      defaults: { valor: 0 }
    });
    c.valor += 1;
    await c.save();
    res.json({ nombre: c.nombre, valor: c.valor });
  } catch (e) {
    res.status(500).json({ msg: 'Error al incrementar contador' });
  }
});

module.exports = router;
