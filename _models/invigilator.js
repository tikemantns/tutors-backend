const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


let invigilatorSchema = new Schema({
	name: { type: String, required: true, index: true },
	email: { type: String, unique: true, required: true },
	phone: { type: String, unique: true, required: true },
	password: { type: String, required: true, select: false },
	address: { type: String, required: true, index: true },
	pincode: { type: String, required: true, index: true },
	schools: { type: String, required: true },
	graduation: { type: String, required: true },
	other_education: { type: String },
	experience: { type: String, index: true },
	fee: { type: String, index: true },
	loggedIn_at: { type: Date },
	loggedOut_at: { type : Date },
	created_at: { type : Date, default: Date.now },
	updated_at: { type : Date }
});


invigilatorSchema.index({ 
	name: 'text',
	address: 'text', 
	classes: 'text', 
	experience: 'text', 
	fee: 'text',
	pincode: 'text'
});


invigilatorSchema.pre('save', function(next){
	if (this.password) {
    	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  	}
 	next();
});

invigilatorSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) 
        next('This Email/Phone already exists');
    else next(error);
});

invigilatorSchema.methods.comparePassword = function(password, cb){
	bcrypt.compare(password, this.password, function(err, isMatch){
		if(err) return cb(null, false);
		if(isMatch) return cb(null, isMatch);
	});
}  

module.exports = mongoose.model('Invigilator', invigilatorSchema);