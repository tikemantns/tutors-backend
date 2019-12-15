const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../_models/user');

router.get('/tutors', async (req, res) => {
    try{
			
        let obj = {
            $or: [
                { 'name': { $regex: new RegExp(req.query.search, 'i') } },
                { 'classes': { $regex: new RegExp(req.query.search, 'i') } },
                { 'subjects': { $regex: new RegExp(req.query.search, 'i') } },
                { 'address': { $regex: new RegExp(req.query.search, 'i') } }
            ]
        };

        if(req.query.location){
            obj.$or = (obj.$or || []);
            obj.$or.push({ 'address': { $regex: new RegExp(req.query.location, 'i') } });
        }
        
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
            obj.$and.push({ 'tution_fee': { $gte: parseInt(req.query.tution_fee_start), $lte: parseInt(req.query.tution_fee_end) } });
        }

        let sortObject = {};
        let sortby = req.query.sortby;
        let sortorder = req.query.sortorder;
        sortObject[sortby] = sortorder;
        let options = {
            select:   '-password -phone -email -tokens',
            sort:     sortObject,
            lean:     true,
            offset:   parseInt(req.query.page), 
            limit:    parseInt(req.query.per_page)
        };
        return res.json({response: await User.paginate(obj, options)}) 
    }catch(err){
        return res.json({error: err}) 
    }
})

router.get('/logged-in-user', auth, async (req, res) => {
    return res.json(req.user);
})

router.get('/tutor-details', async (req, res) => {
    User.findById(req.query.id).select('-password -phone -email -tokens').then( tutor => {
        return res.json({response: tutor});
    }).catch( error => {
        return res.json({error: error});
    })
})

module.exports = router;
