const express = require('express');
const { Register, Login, Secret, RefreshTokens } = require('../controller/users');
const { isLoggedIn } = require('../middleware/middlewares');
const router = express.Router();

router.post('/signup',Register)
router.post('/login',Login)
router.get('/secret/:id',isLoggedIn,Secret)
router.post('/refreshtoken/:id',RefreshTokens)


module.exports = router