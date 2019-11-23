const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


let userSchema = new Schema({
	name: { type: String, required: true, index: true },
	email: { type: String, unique: true, required: true },
	phone: { type: String, unique: true, required: true },
	gender: { type: String, required: true },
	password: { type: String, required: true },
	address: { type: String, required: true, index: true },
	type: { type: String, required: true },
	schools: { type: String, required: true },
	graduation: { type: String, required: true },
	other_education: { type: String },
	classes: { type: String, index: true },
	subjects: { type: String, index: true },
	experience: { type: String, index: true },
	mode_of_tutoring: { type: String, index: true },
	tution_fee: { type: Number, index: true },
	institue: { type: String },
	loggedIn_at: { type: Date },
	loggedOut_at: { type : Date },
	created_at: { type : Date, default: Date.now },
	updated_at: { type : Date }
});


userSchema.index({ 
	name: 'text',
	address: 'text', 
	classes: 'text', 
	experience: 'text', 
	subjects: 'text' 
});


userSchema.pre('save', function(next){
    this.password = this.password?bcrypt.hashSync(this.password, bcrypt.genSaltSync(10)):'';
 	next();
});

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) 
        next('This Email/Phone already exists');
    else next(error);
});


userSchema.methods.comparePassword = function(password, cb){
	bcrypt.compare(password, this.password, function(err, isMatch){
		if(err){ return cb(null, false) }
		if(isMatch){ return cb(null, isMatch) }
	});
}  

module.exports = mongoose.model('User', userSchema);