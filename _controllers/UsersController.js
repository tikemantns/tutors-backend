var mongoose = require('mongoose');
var User = require('../_models/user');
var jwt = require('jsonwebtoken');

class TutorController {

	getSearchTutors = async (req, res) => {
		User.find(req.query).then( list => { 
			return res.json({response: list}) 
		}).catch( error => { 
			return res.json({error: error}) 
		});
	}

	getTutor = async (req, res) => {
		return res.json(await jwt.verify((req.headers.authorization).split(' ')[1], process.env.SECRET_KEY));
	}
	
}

module.exports = TutorController;