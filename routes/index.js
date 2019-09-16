var express = require('express');
var routes = express.Router();

const users = require('./users');
const auth = require('./auth');
const invigilator = require('./invigilator');

routes.use('/users', users);
routes.use('/auth', auth);
routes.use('/inv', invigilator);


/* GET home page. */
routes.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = routes;
