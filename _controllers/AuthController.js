var User = require('../_models/user');
var bcrypt = require('bcrypt');


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
		    if(result) return res.json({response: result}); else return res.json({response: result});
		}catch(err){
			return res.json({response: err});
		}			
	}
}

module.exports = AuthController;