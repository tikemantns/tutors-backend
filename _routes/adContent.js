var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
const apicache = require('apicache');

const adContentController = require('../_controllers/adContentController');
const controller = new adContentController();

const upload = require('../_helpers/helpersFileUpload');
const singleUpload = upload.single('file');


router.post('/add-ad-content', passport.authenticate('jwt', { session: false }), (req, res) => controller.createAdContent(req, res));
router.get('/get-ad-content', passport.authenticate('jwt', { session: false }), (req, res) => controller.getAdContent(req, res));
router.delete('/delete-attachements', passport.authenticate('jwt', { session: false}), (req,res) => controller.deleteAttachment(req, res));
router.delete('/delete-campaign-attachements', passport.authenticate('jwt', { session: false }), (req, res) => controller.deleteCampaignAttachment(req, res));

router.post('/upload', function(req, res){
	singleUpload(req, res, function(err) {
	    if (err) {
	      return res.status(422).send({response: [{title: 'Image Upload Error', detail: err.message}]});
	    }
	    return res.json({'url': req.file.location});
	});
});

module.exports = router;