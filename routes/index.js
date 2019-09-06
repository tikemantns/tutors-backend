var express = require('express');
var routes = express.Router();

const users = require('./users');
const auth = require('./auth');

routes.use('/users', users);
routes.use('/auth', auth);


/* GET home page. */
routes.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = routes;
