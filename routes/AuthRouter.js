const express = require('express');
const { login, register, logout } = require('../controller/AuthController');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);

module.exports = router;
