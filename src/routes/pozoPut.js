const express = require('express');
const router = express.Router();
// Importás tu controlador individual de Put
const { actualizarPozo } = require('./controllers/controllerPut');

router.put('/:id', actualizarPozo);

module.exports = router;