const express = require('express');
const routes = require('./routes'); 

const router = express.Router();
router.use('/',routes);
module.exports = router;