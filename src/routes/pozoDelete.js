const express = require('express');
const router = express.Router();
// Importás tu controlador individual de Delete
const { eliminarPozo } = require('./controllers/controllerDelete');

router.delete('/:id', eliminarPozo);

module.exports = router;