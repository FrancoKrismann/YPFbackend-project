const express = require('express');
const router = express.Router();
// Importás tu controlador individual de Post
const { crearPozo } = require('./controllers/controllerPost'); // Ajustá la ruta relativa si es necesario

router.post('/', crearPozo);

module.exports = router;