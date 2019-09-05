var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var request = require('request');
var bcrypt = require('bcrypt-nodejs');

var Orders = require("../_models/orders");
var Campaign = require("../_models/campaign");
var Coupon = require('../_models/couponData');
var InventoryInstance = require("../_models/inventoryInstance");
var helpersMethods = require("../_helpers/helpersMethods");


/**
 * @
*/

class orderController {

	placeOrder(req, res){
		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
		req.body.order_placed_by_id = loggedInUser._id;
		req.body.payment.payment_by = loggedInUser._id;
		var newOders = new Orders(req.body);
 		
	  	newOders.save(function(err, doc) {
			if (err) {
	      		return res.json({success: false, response: err});
	    	} else {
				Campaign.findByIdAndUpdate(
					req.body.campaign_id,
					{ status: 1, order_id: doc._id, inventory_instance: req.body.inventory_instance },
					(err, doc) => {
						if (err) res.json({response: { success: false, response: err }}); 
						else {
							req.body.inventory_instance.forEach((element) => {
								// console.log(element)
								InventoryInstance.findByIdAndUpdate(
									element.instance,
									{ status: 3, purchased_by: loggedInUser._id, campaign_id: req.body.campaign_id, purchased_ad_groupid: loggedInUser.group_id },
									(err, doc) => {
										if(err) {
											// res.json({ response: { success: false, response: err } }); 
										} else {
											console.log(doc);
											// res.json({ success: true, response: 'Order has been placed Successfully.' });
										}
									}
								)
							})

							res.json({ success: true, response: 'Order has been placed Successfully.' });
						}
					}
				)
			}
	    	
		  });
	}

	orderDetails(req, res){
		Orders.find({ _id: req.query.id })
				.populate('advertiser_id')
				.populate('inventory_id')
				.populate('campaign_id')
				.populate('inventory_instance.instance')
				.populate('updated_by')
				.exec((err, doc) => {
					if(err){
						return res.json(err);
					}
					return res.json({"response": doc});
				})
	}

	//new get order list
	getOrderList(req, res) {

		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
		var page = parseInt(req.query.page) || 0; 
		var limit = parseInt(req.query.limit) || 10;
		var sortKey = {};
		var obj = {};

		Orders.find(
			{ inventory_instance: { "$elemMatch": { pub_id: loggedInUser.group_id } } , status: req.query.status }
		).populate('order_placed_by_id')
		.populate('inventory_id')
		.populate('campaign_id')
			.populate({
				path: 'inventory_instance.instance',
				populate: [
							{ path: 'ad_content_id', model: 'AdContent'},
							{ path: 'inventory_id', model: 'Inventory' }
						], 
				match: { 'pub_id': loggedInUser.group_id } ,
			})		
		.populate('updated_by')
		.sort(sortKey)
		.skip(page * limit)
		.limit(limit)
		.exec((err, doc) => {
			if (err) res.json({ response: { success: false, msg: err } });
			else {
				Orders.count(
					{ pub_id: loggedInUser.group_id }
				).sort(sortKey)
					.skip(page * limit)
					.limit(limit)
					.exec((err2, count) => {
						if (err) {
							return res.json({ response: { success: false, msg: err2 } });
						} else {
							return res.json({
								"response": {
									total: count,
									page: page,
									pageSize: doc.length,
									orders: doc
								}
							});
						}
					});
			}
		})
	}

	updateOrder(req, res){

		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
		req.body.updated_by = loggedInUser._id;
		var obj = { "$set": req.body };
		Orders.findByIdAndUpdate({ _id: req.query.id }, obj, { new: true }, (err, doc) => {
		    if (err) {
		        return res.json({response: false, error: err});
		    }else{
		    	doc.updated_on = new Date();
		    	doc.save();
		    	res.json({response: true});	
		    }
		    
		});
	}

	updateOrderCampaign(req, res) {
		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));

		Orders.findByIdAndUpdate(
			req.query.order_id,
			{
				$push: { pub_id: req.body.pub_id, inventory_instance: req.body.inventory_instance, payment: req.body.payment }
			},
			(err, result) => {
				if (err) return res.json({ success: false, response: err });
				else {
					// res.json({response: result});
					Campaign.findByIdAndUpdate(
						req.body.campaign_id,
						{
							$push: { inventory_instance: req.body.inventory_instance }
						}, 
						(err, campDoc) => {
							if (err) return res.json({ success: false, response: err });
							else {
								req.body.inventory_instance.forEach((element) => {
									// console.log(element)
									InventoryInstance.findByIdAndUpdate(
										element.instance,
										{ status: 3, purchased_by: loggedInUser._id, campaign_id: req.body.campaign_id, purchased_ad_groupid: loggedInUser.group_id },
										(err, doc) => {
											if (err) {
												// res.json({ response: { success: false, response: err } }); 
											} else {
												console.log(doc);
												// res.json({ success: true, response: 'Order has been placed Successfully.' });
											}
										}
									)
								})

								res.json({ success: true, response: 'Order updated successfully.' });
							}
							
						}
					)
				}
			}
		)
	}


}

module.exports = orderController;
