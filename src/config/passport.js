var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../_models/user');

module.exports = passport => {
	var options = {};
	options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	options.secretOrKey =  process.env.SECRET_KEY;
	passport.use(new JwtStrategy(options, (jwt_payload, done) => {
		User.findOne(jwt_payload.id, (err, user) => {
			if(err) return done(null, false);
			if(user) done(null, user) 
				else done(null, false); 
		});
	}));
};