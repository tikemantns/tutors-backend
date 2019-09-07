var express = require('express');
var router = express.Router();
const AuthController = require('../_controllers/AuthController');
const TokenVerfication = require('../config/middleware');
const controller = new AuthController();
const tokenVerify = new TokenVerfication();

router.post('/register', (req, res) => controller.registerUser(req, res));
router.post('/login', (req, res) => controller.loginUser(req, res));
router.get('/user', tokenVerify.validateToken, (req, res) => controller.getUser(req, res));


module.exports = router;
