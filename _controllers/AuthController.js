var User = require('../_models/user');
var bcrypt = require('bcrypt');
// const session = require('express-session');



class AuthController {
	
	registerUser =  (req, res)=>{
		const newUser = new User(req.body); 
		newUser.save((err, user)=>{
			if(err) return res.json({response: err});
			return res.json({response: true});
		})
	} 

	loginUser = async (req, res) => {
		try{
			let user = await User.find({email: req.body.email});
			if(!user) return res.json(new Error("User not found"));
			let result = await bcrypt.compareSync(req.body.password, user[0].password);
		    if(result){
		    	req.session.token = req.body.email;
		    	const salt = bcrypt.genSaltSync(10);
		    	return res.json({response: result, token: bcrypt.hashSync(req.body.email, salt)}); 
		    }else{ 
		    	return res.json({response: result});
		    }
		}catch(err){
			return res.json({response: err});
		}			
	}

	getUser = async (req, res) => {
		res.send("res");
	}
}

module.exports = AuthController;