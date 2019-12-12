var express = require('express');
var router = express.Router();
var Invigilator = require('../_models/invigilator');

router.get('/invigilators', async (req, res) => {
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
})

module.exports = router;
