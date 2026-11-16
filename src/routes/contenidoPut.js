const express = require('express');
const router = express.Router();
const controller = require('./controllers/controllerPut.js');

// Ruta Put /:id: Actualizamos un contenido específico por su ID
router.put('/:id', controller.actualizarContenido);

module.exports = router;