var express = require('express');
var router = express.Router();
var passport = require('passport');

const InvigilatorController = require('../_controllers/InvigilatorController');
const controller = new InvigilatorController();

router.get('/invigilators', (req, res) => controller.getSearchInvigilators(req, res));


router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
