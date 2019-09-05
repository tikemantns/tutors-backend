var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var request = require('request');
var bcrypt = require('bcrypt-nodejs');

var User = require("../_models/user");
var Menu = require("../_models/menu");
var helpersMethods = require("../_helpers/helpersMethods");


/**
 * @Login, Register, forgot-Password, Logout, GetOTP
*/

class authController {

	registerUser(req, res){
		// if (!req.body.email || !req.body.password) {
		//   	res.json({success: false, response: 'Please provide email and password.'});
		// } else {

		var newUser = {};
		if (req.query.adding_user == 0) {
			var group_id = "pub" + req.body.phone;
			if (req.body.type == 2) {
				group_id = "ad" + req.body.phone;
			}

			newUser = new User({
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				type: req.body.type,
				admin_rights: req.body.admin_rights,
				password: req.body.password,
				group_id: group_id
			});
		} else {
			var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
			var group_id = loggedInUser.group_id;
			var password = req.body.phone.substring(0, 5);

			newUser = new User({
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				type: req.body.type,
				admin_rights: req.body.admin_rights,
				password: password,
				group_id: group_id
			});
		}
		  
		newUser.save(function(err) {
			if (err) {
				return res.json({success: false, response: err});
			}
			res.json({success: true, response: 'Successful created new user.'});
		});
		// }
	}

	loginUser(req, res){

		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;		
		var obj = { email: req.body.userName };
		if(!(re.test(String(req.body.userName).toLowerCase()))){
			obj = { phone: req.body.userName };
		}

		User.findOne(obj, 
			function(err, user) {
				if (err) throw err;
				if (!user) {
					res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
				} else {
					user.comparePassword(req.body.password, function (err, isMatch) {
					if (isMatch && !err) {
						var token = jwt.sign(user.toJSON(), config.secret, {
							expiresIn: 604800 // 1 week
						});
						user.loggedIn_at = new Date();
						user.save();
						res.json({success: true, token: token});
					} else {
						res.status(401).send({success: false, response: 'Authentication failed. Wrong password.'});
					}
				});
			}
		});
	}

	getOtp(req, res){
		
		User.findOne({ phone: req.body.userPhone }, 
			function(err, user) {
				if (err) throw err;
				if (!user) {
					res.status(401).send({success: false, response: 'User not found.'});
				} else {
					var randomNumbers = Math.floor(100000 + Math.random() * 900000);
					var randomOtp = "Your OTP for verification is "+randomNumbers;
					var senderId = 'ONEHLT';
					var url = 'http://smpp.keepintouch.co.in/vendorsms/pushsms.aspx?user=health&password=1Health1*&msisdn=91'+req.body.userPhone+'&sid='+senderId+'&msg='+randomOtp+'&fl=0&gwid=2';
					var options = {url: url};
					
					request(options, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							if (err) {
					      		return res.json({success: false, response: err});
					    	}
					    	res.json({success: true, response: body,otp: randomNumbers});
					    }
					});	
				}
		});
	}

	forgotPassword(req, res){

		bcrypt.genSalt(10, function (err, salt) {
		    if (err) {
		        return next(err);
		    }
		    bcrypt.hash(req.body.newPassword, salt, null, function (err, hash) {
		        if (err) {
		            return next(err);
		        }
		        req.body.newPassword = hash;
		        User.findOneAndUpdate({ phone: req.body.userPhone }, {$set:{password: req.body.newPassword}}, {new: true}, (err, doc) => {
		            if (err) {
		                return res.json({success: false, response: err});
		            }else{
		            	doc.updatedAt = new Date();
		            	doc.save();
		            	res.json({success: true, response: 'Successfully updated password'});	
		            }
		            
		        });
		    });
		});
	}

	loggedInUser(req, res){
		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
		User.find({ _id: loggedInUser._id })
				.exec((err, doc) => {
					if(err){
						return res.json(err);
					}
					return res.json({ response: doc });
				})
	}

	updateUser(req, res){
		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
		req.body.updated_by = loggedInUser._id;

		var obj = { "$set": req.body };

		User.findByIdAndUpdate({ _id: loggedInUser._id }, obj, { new: true }, (err, doc) => {
		    if (err) {
		        return res.json({success: false, response: err});
		    }else{
		    	doc.updatedAt = new Date();
		    	doc.save();
		    	res.json({success: true, response: doc});	
		    }
		    
		});	
	}

	logoutUser(req, res){
		
		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));

		User.findOneAndUpdate({ phone: loggedInUser.phone }, {$set:{loggedOut_at: new Date()}}, {new: true}, (err, doc) => {
		    if (err) {
		        return res.json({success: false, response: err});
		    }else{
		    	req.logout();
		    	res.json({success: true, response: 'Sign out successfully.'});
		    }		    
		});	
	}

	addUser(req, res) {
		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
		// console.log(loggedInUser); return;
		if (!req.body.email || !req.body.phone) {
			res.json({ success: false, response: 'Please pass email and phone.' });
		} else {

			var group_id = loggedInUser.group_id;
			var password = req.body.phone.substring(0, 5);
			
			var newUser = new User({
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				type: req.body.type,
				admin_rights: req.body.admin_rights,
				password: password,
				group_id: group_id
			});

			newUser.save(function (err) {
				if (err) {
					return res.json({ success: false, response: err });
				}
				res.json({ success: true, response: 'Successful created new user.' });
			});
		}
	} 

	getMenuItems(req, res) {
		var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));

		Menu.find(
			{ type: loggedInUser.type }, 
			(err, menu) => {
				if(err) res.json({ success: false, msg: err });
				else {
					res.json({ success: true, menu: menu});
				}
			}
		)
	}
}

module.exports = authController;
