var mongoose = require('mongoose');
var User = require('../_models/user');


class TutorController {
	getSearchTutors = (req, res) => {
		res.send("Hello everyone");
	}
}

module.exports = TutorController;