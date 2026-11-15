const express = require('express');
const contenidoGet = require('./contenidoGets.js');
const pozosPost = require('./pozoPost.js');
const pozosPut = require('./pozoPut.js');
const pozosDelete = require('./pozoDelete.js');
const router = express.Router();

router.use("/contenido", contenidoGet);
// router.use("/contenido");
// router.use("/contenido");
// router.use("/contenido");

module.exports = router;
