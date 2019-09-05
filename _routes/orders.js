var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();


const ordersController = require("../_controllers/ordersController");
const controller = new ordersController();

router.post('/place-order', passport.authenticate('jwt', { session: false}), (req,res) => controller.placeOrder(req, res));
router.get('/order-details', passport.authenticate('jwt', { session: false}), (req,res) => controller.orderDetails(req, res));
router.get('/get-orders', passport.authenticate('jwt', { session: false }), (req, res) => controller.getOrderList(req, res));
router.put('/update-order', passport.authenticate('jwt', { session: false }), (req, res) => controller.updateOrder(req, res));
router.put('/update-order-campaign', passport.authenticate('jwt', { session: false }), (req, res) => controller.updateOrderCampaign(req, res));



module.exports = router;
