const express = require('express');
const router = express.Router();
const User = require('../_models/user');
const Invigilator = require('../_models/invigilator');
const bcrypt = require('bcrypt');


router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body); 
        const user = await newUser.save();
        if(!user) return res.json({error: "Something went wrong. Please trying again."});
        if(user) return res.json({"success": true});
    }catch(err){
        return res.json({error: err});
    }
})

router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        return res.json({response: {user, token}});
    }catch(err){
        console.log(err)
        return res.json({error: err});
    }
})

router.post('/invigilator-registration', async (req, res) => {
    try {
        const invigilator = new Invigilator(req.body);
        const registeredInvigilator = await invigilator.save();
        if(!registeredInvigilator) return res.json({error: "Something went wrong. Please trying again."});
        if(registeredInvigilator) return res.json({"success": true});
    }catch(err){
        return res.json({error: err});
    }
})

router.post('/invigilator-login', async (req, res) => {
    try{
        let invigilator = await Invigilator.findOne({email: req.body.email});
        invigilator.comparePassword(req.body.password, (err,isMatch) => {
            if(isMatch && !err){
                const token = jwt.sign(invigilator.toJSON(), process.env.SECRET_KEY, { expiresIn: 604800 });
                res.header({'Authorization': token});
                return res.json({token: token});
            } else {
                return res.json({error: "Invalid Credential. Please try again"});
            }
        })
    }catch(err){
        return res.send(err);
    }
})

module.exports = router;
