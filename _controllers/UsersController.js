var mongoose = require('mongoose');
var User = require('../_models/user');
var jwt = require('jsonwebtoken');

class TutorController {

	getSearchTutors = async (req, res) => {
		let obj = {};
		if(req.query.search){
			let term = new RegExp(req.query.search, 'i');
			obj = { "$text": { "$search": term  } };
		}
		User.find(obj).then( list => { 
			return res.json({response: list}) 
		}).catch( error => { 
			return res.json({error: error}) 
		});
	}

	loggedInUser = async (req, res) => {
		let user = await jwt.verify((req.headers.authorization).split(' ')[1], process.env.SECRET_KEY);
		delete user.password;
		return res.json(user);
	}

	viewTutorsDetails = async (req, res) => {
		User.findById(req.query.id).then( tutor => {
			return res.json({response: tutor});
		}).catch( error => {
			return res.json({error: error});
		});
	}  
	
}

module.exports = TutorController;