const express = require('express');
const Routes = require('./routes');

const router = express.Router();

router.use('/', Routes);

module.exports = router;
