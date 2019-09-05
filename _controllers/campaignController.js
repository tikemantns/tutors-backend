var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var request = require('request');
var bcrypt = require('bcrypt-nodejs');

var Campaign = require("../_models/campaign");
var helpersMethods = require("../_helpers/helpersMethods");


/**
 * @Create Campaign, Get Campaigns, Update Campaign, Get Campaign Details
*/

class campaignController {

	createCampaign(req, res){
		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
		req.body.created_by_id = loggedInUser._id;
		req.body.advertiser_group_id = loggedInUser.group_id;
 		var newCampaign = new Campaign(req.body);
 		
	  	newCampaign.save(function(err, doc) {
			if (err) {
	      		return res.json({success: false, response: err});
	    	}
	    	res.json({success: true, response: 'Campaign Successfully created.', campaign_id: doc._id});
	  	});	
	}

	_getCampaigns(req, res){

	    var token = helpersMethods.getToken(req.headers);
	    var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
	    var advertiserGroupId = loggedInUser.group_id;
	    var page = parseInt(req.query.page) || 0; //for next page pass 1 here
	    var pageSize = parseInt(req.query.pageSize) || 10;

	    var term = new RegExp(req.query.search, 'i');
	    var sortKey = {};
	    var obj = {};
	    var status = [1,2,3];
	    
	    if(req.query.search){
	    	obj = { "$text": { "$search": term  } };
	    	sortKey = { "score": { "$meta": "textScore" } };
	    }
	    if(req.query.status=='past'){
	    	status = [4,5];
	    }else if(req.query.status != 'past' && req.query.status != 'active'){
	    	status = [req.query.status];
	    }
	    
	    if (token) {
	        Campaign.find(obj,sortKey)
	        	.populate( 'created_by_id')
	        	.where('status').in(status)
	        	.where({'advertiser_group_id': advertiserGroupId})
	        	.sort(sortKey)
	        	.skip(page * pageSize) 
	        	.limit(pageSize)
	        	.exec((err, docs) => {
	        		if (err) {
	        			return res.json(err);
	        		}else{
    	            	Campaign.count({}).where('status').where({'advertiser_group_id': advertiserGroupId}).in(status).exec((count_error, count) => {
    	            		if (err) {
    	            			return res.json(count_error);
    	            		}else{
    	            			return res.json({ "response": {
    	            				total: count,
    	            				page: page,
    	            				pageSize: pageSize,
    	            				campaigns: docs
    	            			}});
    	            		}
    	            		
    	            	});
	        		}
		        	
	        	});
	    } else {
	        return res.status(403).send({success: false, response: 'Unauthorized.'});
	    }

	}

	updateCampaigns(req, res){

		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
		req.body.updated_by = loggedInUser._id;

		var obj = { "$set": req.body };

		Campaign.findByIdAndUpdate({ _id: req.query.id }, obj, { new: true }, (err, doc) => {
		    if (err) {
		        return res.json({success: false, response: err});
		    }else{
		    	doc.updated_on = new Date();
		    	doc.save();
		    	res.json({success: true,response: doc});	
		    }
		    
		});
	}

	addFilesToCampaign(req, res) {

		var updateArr = {};
		if(req.body.add_url != null) {
			updateArr = { $push: {  added_url: req.body.add_url }};
		}

		if(req.body.attach_file != null) {
			updateArr = { $push: { attached_file: req.body.attach_file } };
		}

		if(req.body.add_url != null && req.body.attach_file != null) {
			updateArr = { $push: { attached_file: req.body.attach_file, added_url: req.body.add_url }};
		}

		Campaign.findByIdAndUpdate(
			req.query.id,
			updateArr,
			(err, doc) => {
				if(err) console.log(err);
				else {
					res.json({success: true, response: 'File added successfully'});
				}
				
			}
		)

	}

	addInventoryInsanceToCampaign(req, res){
		
		var obj = { "$set": req.body };

		Campaign.findByIdAndUpdate({ _id: req.query.id }, obj, { new: true }, (err, doc) => {
		    if (err) {
		        return res.json({success: false, response: err});
		    }else{
		    	doc.updated_on = new Date();
		    	doc.save();
		    	res.json({success: true,response: doc});	
		    }
		    
		});
	}

	campaignDetails(req, res){
		Campaign.find({ _id: req.query.id })
				.populate({
					path: 'inventory_instance.instance',
					populate: [
					            { path: 'inventory_id', model: 'Inventory' },
								{ path: 'purchased_by', model: 'User' }, 
								{ path: 'ad_content_id', 
									populate: [{ path: 'attached_files.file_uploaded_by' }, {path: 'add_url.url_added_by' }] 
								}, 
								{ path: 'comment.sender_id' }
					        ]
				})
				.populate('attached_file.file_uploaded_by')
				.populate('added_url.url_added_by')
				.populate('created_by_id')
				.populate('updated_by')
				.exec((err, doc) => {
					if(err){
						return res.json(err);
					}
					return res.json({response: doc});
				})
	}


	deleteAttachedFileAndUrl(req, res) {
					
        var query = { _id: req.query.campaign_id };
        var removeQuery = {};
        //type 1 = removing attached file
        
        if(req.query.type == 1) {
            removeQuery = { $pull: { attached_file: { _id: req.query.attachment_id } } }
        } else {
            removeQuery = { $pull: { added_url: { _id: req.query.attachment_id } } }
        }

        Campaign.findOneAndUpdate(
            query,
            removeQuery,
            { safe: true, upsert: true },
            (err, doc) => {
                if(err) {
                    res.json({ success: false, response: err });
                } else {
                    res.json({ success: true, response: doc });
                }
            }
        )
    }



}

module.exports = campaignController;
