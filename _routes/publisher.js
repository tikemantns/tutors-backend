var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
const apicache = require('apicache');
const cache = apicache.middleware;


const publisherController = require("../_controllers/publisherController");
const controller = new publisherController();


router.get('/get-publishers', cache('5 minutes'), passport.authenticate('jwt', { session: false}), (req,res) => controller._getPublishers(req, res));
router.get('/publisher-details', cache('5 minutes'), passport.authenticate('jwt', { session: false}), (req,res) => controller._getPublishers(req, res));

module.exports = router;
