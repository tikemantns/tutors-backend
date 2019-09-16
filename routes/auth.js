var express = require('express');
var router = express.Router();
const AuthController = require('../_controllers/AuthController');
const controller = new AuthController();

router.post('/register', (req, res) => controller.registerUser(req, res));
router.post('/login', (req, res) => controller.loginUser(req, res));
router.post('/invigilator-registration', (req, res) => controller.registerAsInvigilator(req, res));
router.post('/invigilator-login', (req, res) => controller.loginAsInvigilator(req, res));


module.exports = router;
