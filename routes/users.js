var express = require('express');
var router = express.Router();
var passport = require('passport');

const TutorController = require('../_controllers/TutorController');
const controller = new TutorController();


router.get('/tutors', passport.authenticate('jwt', {session: false}), (req, res) => controller.getSearchTutors(req, res));


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
