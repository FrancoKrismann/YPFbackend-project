const express = require('express');
const router = express.Router();

const contenidoGets = require('./contenidoGets');
const contenidoPost = require('./contenidoPost');
const contenidoPut = require('./contenidoPut');
const contenidoDelete = require('./contenidoDelete');

router.use("/contenido", contenidoGets);
router.use("/contenido", contenidoPost);
router.use("/contenido", contenidoPut);
router.use("/contenido", contenidoDelete);

module.exports = router;