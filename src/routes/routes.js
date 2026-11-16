const express = require('express');
const contenidoGet = require('./contenidoGets.js');
const pozosPost = require('./contenidoPost.js');
const pozosPut = require('./contenidoPut.js');
const pozosDelete = require('./contenidoDelete.js');
const router = express.Router();

router.use("/contenido", contenidoGet);
// router.use("/contenido");
// router.use("/contenido");
// router.use("/contenido");

module.exports = router;
