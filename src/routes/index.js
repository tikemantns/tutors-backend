var express = require('express');
var routes = express.Router();

const users = require('./users');
const auth = require('./auth');
const invigilator = require('./invigilator');
const main = require('./main');
const questionBank = require('./question-bank');

routes.use('/users', users);
routes.use('/auth', auth);
routes.use('/inv', invigilator);
routes.use('/main', main);
routes.use('/question-bank', questionBank);


/* GET home page. */
routes.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = routes;
