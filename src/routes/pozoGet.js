const express = require('express');
const router = express.Router();
const controller = require('./controllers/controllerGet.js');

//Ruta Get:/: Obtenemos todos los pozos de la base de datos
router.get('/', controller.obtenerPozos);

router.get('/yacimiento/:yacimiento', controller.obtenerPorYacimiento);

router.get('/:id', controller.obtenerPorId);

module.exports = router;