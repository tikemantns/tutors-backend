var mongoose = require('mongoose');
var Invigilator = require('../_models/invigilator');

class InvigilatorController {
	
	getSearchInvigilators = async (req, res) => {
		let obj = {};
		if(req.query.search){
			let term = new RegExp(req.query.search, 'i');
			obj = { "$text": { "$search": term  } };
		}
		Invigilator.find(obj).then( list => { 
			return res.json({response: list}) 
		}).catch( error => { 
			return res.json({error: error}) 
		});
	}

}

module.exports = InvigilatorController;