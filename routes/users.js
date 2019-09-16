var express = require('express');
var router = express.Router();
var passport = require('passport');

const UsersController = require('../_controllers/UsersController');
const controller = new UsersController();


router.get('/tutors', (req, res) => controller.getSearchTutors(req, res));
router.get('/logged-in-user', passport.authenticate('jwt', {session: false}), (req, res) => controller.loggedInUser(req, res));
router.get('/tutor-details', (req, res) => controller.viewTutorsDetails(req, res));


router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
