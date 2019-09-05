var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();






const authController = require("../_controllers/authController");
const controller = new authController();

router.post('/register', (req, res) => controller.registerUser(req, res));
router.post('/login', (req, res) => controller.loginUser(req, res));
router.put('/update-user-details', passport.authenticate('jwt', { session: false}), (req, res) => controller.updateUser(req, res));
router.post('/request-otp', (req, res) => controller.getOtp(req, res));
router.post('/forgot-password', (req, res) => controller.forgotPassword(req, res));
router.get('/me', passport.authenticate('jwt', { session: false}), (req, res) => controller.loggedInUser(req, res));
router.post('/logout', passport.authenticate('jwt', { session: false}), (req, res) => controller.logoutUser(req, res));
router.post('/add-user', passport.authenticate('jwt', { session: false }), (req, res) => controller.addUser(req, res));
router.get('/get-menu-items', passport.authenticate('jwt', { session: false }), (req, res) => controller.getMenuItems(req, res));

module.exports = router;
