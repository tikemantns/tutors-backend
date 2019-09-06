const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


let userSchema = new Schema({
	name: { type: String, required: true, text: true },
	email: { type: String, unique: true, required: true },
	phone: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	address: { type: String, required: true },
	type: { type: String, required: true },
	schools: { type: String, required: true },
	graduation: { type: String, required: true },
	other_education: { type: String },
	classes: { type: String },
	subjects: { type: String },
	experience: { type: String },
	mode_of_tutoring: { type: String },
	tution_fee: { type: String },
	institue: { type: String },
	loggedIn_at: { type: Date },
	loggedOut_at: { type : Date },
	created_at: { type : Date, default: Date.now },
	updated_at: { type : Date }
});

userSchema.pre('save', function(next){
	if (this.password) {
    	const salt = bcrypt.genSaltSync(10);//or your salt constant
    	this.password = bcrypt.hashSync(this.password, salt);
  	}
 	next();
});


module.exports = mongoose.model('User', userSchema);