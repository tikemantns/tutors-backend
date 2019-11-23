var mongoose = require('mongoose');
var User = require('../_models/user');
var jwt = require('jsonwebtoken');

class TutorController {

	getSearchTutors = async (req, res) => {
		try{

			let obj = {
			    $or: [
			        { 'name': { $regex: new RegExp(req.query.search, 'i') } },
			        { 'classes': { $regex: new RegExp(req.query.search, 'i') } },
			        { 'subjects': { $regex: new RegExp(req.query.search, 'i') } }
			    ]
			};

			if(req.query.gender){
			    obj.$and = (obj.$and || []);
			    obj.$and.push({ 'gender': req.query.gender });
			}
			if(req.query.mode_of_tutoring){
			    obj.$and = (obj.$and || []);
			    obj.$and.push({ 'mode_of_tutoring': req.query.mode_of_tutoring });
			}
			if(req.query.tution_fee_start && req.query.tution_fee_end){
			    obj.$and = (obj.$and || []);
			    obj.$and.push({ 'tution_fee': { $gt: req.query.tution_fee_start, $lt: req.query.tution_fee_end } });
			}

			let sortObject = {};
			let sortby = req.query.sortby;
			let sortorder = req.query.sortorder;
			sortObject[sortby] = sortorder;

			return res.json({response: await User.find(obj).select('-password -phone -email').sort(sortObject)}) 
		}catch(err){
			return res.json({error: err}) 
		}
	}

	loggedInUser = async (req, res) => {
		let user = await jwt.verify((req.headers.authorization).split(' ')[1], process.env.SECRET_KEY);
		delete user.password;
		return res.json(user);
	}

	viewTutorsDetails = async (req, res) => {
		User.findById(req.query.id).select('-password -phone -email').then( tutor => {
			return res.json({response: tutor});
		}).catch( error => {
			return res.json({error: error});
		});
	}  
	
}

module.exports = TutorController;