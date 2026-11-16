const express = require('express');
const router = express.Router();
const controller = require('./controllers/controllerPost.js');

// Ruta Post /: Creamos un nuevo contenido en la base de datos
router.post('/', controller.crearContenido);

module.exports = router;