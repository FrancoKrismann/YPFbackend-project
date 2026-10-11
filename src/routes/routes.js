const express = require('express');
const pozosGet = require('./pozoGet.js');
const pozosPost = require('./pozoPost.js');
const pozosPut = require('./pozoPut.js');
const pozosDelete = require('./pozoDelete.js');
const router = express.Router();

router.use("/pozos",pozosGet);
// router.use("/pozos",pozosPost);
// router.use("/pozos",pozosPut);
// router.use("/pozos",pozosDelete);



module.exports = router;
