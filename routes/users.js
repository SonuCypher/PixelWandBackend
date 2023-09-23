const express = require('express');
const { Register, Login, Secret, RefreshTokens, Logout } = require('../controller/users');
const { isLoggedIn } = require('../middleware/middlewares');
const router = express.Router();

router.post('/signup',Register)
router.post('/login',Login)
router.post('/logout/:id',Logout)
router.get('/secret/:id',isLoggedIn,Secret)
router.post('/refreshtoken/:id',RefreshTokens)


module.exports = router