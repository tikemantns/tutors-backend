var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

module.exports = {
	getToken: function (headers) {
		if (headers && headers.authorization) {
			var parted = headers.authorization.split(' ');
			if (parted.length === 2) {
				return parted[1];
			} else {
				return null;
			}
		} else {
			return null;
		}
	},
	getLoggedInUser: function(token){
		var loggedInUser = jwt.verify(token, config.secret);
		return loggedInUser;
	}
}

