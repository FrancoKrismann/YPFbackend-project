const express = require('express');
const router = express.Router();
const controller = require('./controllers/controllerGet.js');

// Rutas GET con parámetros específicos en URL
router.get('/titulo/:titulo', controller.obtenerContenidos);
router.get('/categoria/:categoria', controller.obtenerContenidos);
router.get('/genero/:genero', controller.obtenerContenidos);
router.get('/actor/:actor', controller.obtenerContenidos);
router.get('/reparto/:actor', controller.obtenerContenidos);

// Ruta GET /: Obtenemos todos los contenidos o filtramos por query params (?titulo=...&categoria=...&genero=...&actor=...)
router.get('/', controller.obtenerContenidos);

// Ruta GET /:id: Obtenemos un contenido específico por su ID numérico
router.get('/:id', controller.obtenerContenidoPorId);

module.exports = router;
