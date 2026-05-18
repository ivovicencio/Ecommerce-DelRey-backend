const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/perfil', verificarToken, authCtrl.perfil);

module.exports = router;
