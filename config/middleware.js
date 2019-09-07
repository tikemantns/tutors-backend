var bcrypt = require('bcrypt');


class TokenVerfication {
	validateToken = async (req, res, next)=>{
		try{
			let result = await bcrypt.compareSync(req.session.token, req.query.token);
			if(!result) {
				const err =  new Error('Unauthorized request');	
				next(err);
			}else{
				next();
			}	
		}catch(err){
			next(err);
		}
	}
}

module.exports = TokenVerfication;