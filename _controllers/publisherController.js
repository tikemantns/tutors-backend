var User = require("../_models/user");
var helpersMethods = require("../_helpers/helpersMethods");

class publisherController {

	_getPublishers(req, res) {
	    var token = helpersMethods.getToken(req.headers);
	    var page = parseInt(req.body.page) || 0; //for next page pass 1 here
	    var limit = parseInt(req.body.limit) || 10;
	    var obj = {type: 1,name: new RegExp(req.body.name, 'i')};
	    if (token) {
	        User.find(obj)
	        	.sort({ updateAt: -1 })
	        	.skip(page * limit) 
	        	.limit(limit)
	        	.exec((err, doc) => {
	        		if (err) {
	        		return res.json(err);
	        		}
	        	User.count(obj).exec((count_error, count) => {
	        		if (err) {
	        		return res.json(count_error);
	        		}
	        		return res.json({
		        		total: count,
		        		page: page,
		        		pageSize: doc.length,
		        		publishers: doc
	        		});
	        	});
	        });
	    } else {
	        return res.status(403).send({success: false, msg: 'Unauthorized.'});
	    }
	}

}

module.exports = publisherController;
