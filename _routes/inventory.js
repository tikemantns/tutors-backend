var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
const apicache = require('apicache');
const cache = apicache.middleware;

const inventoryController = require("../_controllers/inventoryController");
const controllers = new inventoryController();

router.post('/create-inventory', passport.authenticate('jwt', { session: false }), (req, res) => controllers.createInventory(req, res));
router.post('/add-inventory-instance', passport.authenticate('jwt', { session: false }), (req, res) => controllers.addInventoryInstance(req, res));
router.get('/get-inventory-list', passport.authenticate('jwt', { session: false }), (req, res) => controllers.getInventoryList(req, res));
router.put('/update-inventory', passport.authenticate('jwt', { session: false }), (req, res) => controllers.updateInventory(req, res));
router.put('/update-inventory-instance', passport.authenticate('jwt', { session: false }), (req, res) => controllers.updateInventoryInstance(req, res));
router.delete('/delete-inventory', passport.authenticate('jwt', { session: false }), (req, res) => controllers.deleteInventory(req, res));
router.delete('/delete-inventory-instance', passport.authenticate('jwt', { session: false }), (req, res) => controllers.deleteInventoryInstance(req, res));
router.get('/get-inventory-details', passport.authenticate('jwt', { session: false }), (req, res) => controllers.getInventoryDetails(req, res));
router.put('/add-comments', passport.authenticate('jwt', { session: false }), (req, res) => controllers.addComments(req, res));
// router.get('/find-inventory-instance', passport.authenticate('jwt', { session: false }), (req, res) => controllers.findInventoryInstance(req, res));

//advertiser apis
router.get('/get-instance-list', passport.authenticate('jwt', { session: false }), (req, res) => controllers.getInstanceList(req, res)); //getInventoryInstanceList
router.get('/get-instance-details', passport.authenticate('jwt', { session: false }), (req, res) => controllers.getInstanceDetails(req, res));

module.exports = router;