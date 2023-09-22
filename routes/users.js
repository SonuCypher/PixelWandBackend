const express = require('express');
const { Register } = require('../controller/users');
const router = express.Router();

router.post('/signup',Register)


module.exports = router