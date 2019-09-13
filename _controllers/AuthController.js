var User = require('../_models/user');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
	
	registerUser = async (req, res)=>{
		try {
			const newUser = new User(req.body); 
			const user = await newUser.save();
			if(!user) return res.json({error: "Something went wrong. Please trying again."});
			if(user) return res.json({"success": true});
		}catch(err){
			return res.json({error: err});
		}
	} 

	loginUser = async (req, res) => {
		try{
			let user = await User.findOne({email: req.body.email});
			user.comparePassword(req.body.password, (err,isMatch) => {
				if(isMatch && !err){
					const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: 604800 });
					res.header({'Authorization': token});
					return res.json({token: token});
				} else {
					return res.json({error: "Invalid Credential. Please try again"});
				}
			})
		}catch(err){
			return res.send(err);
		}		
	}

}

module.exports = AuthController;