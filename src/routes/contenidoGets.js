const express = require('express');
const router = express.Router();
const controller = require('./controllers/controllerGet.js');

//Ruta Get:/: Obtenemos todos los contenidos de la base de datos
router.get('/', controller.obtenerContenidos);
//Ruta Get:/:id: Obtenemos un contenido específico por su ID
router.get('/:id', controller.obtenerContenidoPorId);


module.exports = router;