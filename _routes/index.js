var express = require('express');
var routes = express.Router();

const auth = require('./auth');
const publisher = require('./publisher');
const campaign = require('./campaign');
const inventory = require('./inventory');
const adContent = require('./adContent');
const orders = require('./orders');


routes.use('/auth', auth);
routes.use('/publisher', publisher);
routes.use('/campaign', campaign);
routes.use('/inventory', inventory);
routes.use('/ad-content', adContent);
routes.use('/orders', orders);


/* GET home page. */
routes.get('/', (req, res, next) => { res.sendfile('./views/index.html') });

module.exports = routes;
