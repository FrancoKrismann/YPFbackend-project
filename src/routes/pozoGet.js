const express = require('express');
const router = express.Router();
const controller = require('./controllers/controllerGet.js');

//Ruta Get:/: Obtenemos todos los pozos de la base de datos
router.get('/', controller.obtenerPozos);
//Ruta Get:/yacimiento/:yacimiento: Obtenemos todos los pozos de un yacimiento específico
router.get('/yacimiento/:yacimiento', controller.obtenerPorYacimiento);
//Ruta Get:/:id: Obtenemos un pozo específico por su ID
router.get('/:id', controller.obtenerPorId);


module.exports = router;