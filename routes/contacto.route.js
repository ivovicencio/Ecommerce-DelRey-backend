const express = require('express');
const router = express.Router();
const contactoCtrl = require('../controllers/contacto.controller');

router.post('/resenas', contactoCtrl.createResena);

module.exports = router;
