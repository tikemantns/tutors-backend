const express = require('express')
const router = express.Router()
const User = require('../_models/user')
const auth = require('../middleware/auth')
const Invigilator = require('../_models/invigilator')
const sendEmail = require('../_helpers/email')

router.post('/send-otp', async (req, res) => {
    try {
        return res.json({"response": {"OTP":"12345"}})
    } catch(e) {
        return res.json({"response": new Error('Something went wrong')})
    }
})

router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body) 
        const user = await newUser.save()
        if(!user) return res.json({error: "Something went wrong. Please try again."})
        return res.json({"success": true, "id": user.id})
    }catch(err){
        return res.json({error: err});
    }
})

router.post('/update-tutor', async (req, res) => {
    try{
        const id = req.body.id
       
        delete req.body.id
        const user = await User.findOneAndUpdate({_id: id}, {$set: req.body}, {useFindAndModify: false} , (err, user) => {
            if(err) {
                return res.json({error: 'Error while update records!'})
            }
            return user
        })
        return res.json({res: user})
    }catch(err){
        return res.json({error: err})
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

router.post('/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter( (token) => {
            return token.token !== req.token
        })
        
        await req.user.save()
        res.send('User looged out successfully')
    } catch(e) {
        res.status(500).send()
    }    

})

router.post('/invigilator-registration', async (req, res) => {
    try {
        const invigilator = new Invigilator(req.body);
        const registeredInvigilator = await invigilator.save();
        if(!registeredInvigilator) return res.json({error: "Something went wrong. Please trying again."});
        return res.json({"success": true});
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
