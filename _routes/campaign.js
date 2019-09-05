var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();


const campaignController = require("../_controllers/campaignController");
const controller = new campaignController();

router.post('/create-campaign', passport.authenticate('jwt', { session: false}), (req,res) => controller.createCampaign(req, res));
router.get('/campaigns', passport.authenticate('jwt', { session: false}), (req,res) => controller._getCampaigns(req, res));
router.put('/update-campaign', passport.authenticate('jwt', { session: false}), (req,res) => controller.updateCampaigns(req, res));
router.put('/add-inventory-instance-to-campaign', passport.authenticate('jwt', { session: false}), (req,res) => controller.addInventoryInsanceToCampaign(req, res));
router.get('/campaign-details', passport.authenticate('jwt', { session: false}), (req,res) => controller.campaignDetails(req, res));
router.delete('/delete-files-url', passport.authenticate('jwt', { session: false}), (req,res) => controller.deleteAttachedFileAndUrl(req, res));
router.put('/add-files-campaign', passport.authenticate('jwt', { session: false }), (req, res) => controller.addFilesToCampaign(req, res));


module.exports = router;
