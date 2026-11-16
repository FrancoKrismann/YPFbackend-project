const express = require('express');
const router = express.Router();
const controller = require('./controllers/controllerDelete.js');

// Ruta Delete /:id: Eliminamos un contenido específico por su ID
router.delete('/:id', controller.eliminarContenido);

module.exports = router;