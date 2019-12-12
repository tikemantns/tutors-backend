const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate');
const jwt = require('jsonwebtoken');
const validator = require('validator');


const userSchema = new Schema({
	name: { type: String, required: true, index: true },
	email: { 
		type: String, 
		unique: true, 
		required: true,
		validate(email){
			if(!validator.isEmail(email)){
				throw new Error("Please Enter Valid Email")
			}
		}
	},
	phone: { 
		type: String, 
		unique: true, 
		required: true,
		validate(phone){
			if(!validator.isMobilePhone(phone)){
				throw new Error("Please Enter Valid Phone Number")
			}
		}
	},
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
	tokens:[{token: {type: String, required: true}}],
	institue: { type: String },
	loggedIn_at: { type: Date },
	loggedOut_at: { type : Date }
},{
	timestamps: true
});

userSchema.plugin(mongoosePaginate);

userSchema.index({ 
	name: 'text',
	address: 'text', 
	classes: 'text', 
	experience: 'text', 
	subjects: 'text' 
});


userSchema.pre('save', function(next){
    this.password = this.password?bcrypt.hashSync(this.password, bcrypt.genSaltSync(10)):''
 	next()
})

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) 
        next('This Email/Phone already exists')
    else next(error)
})

userSchema.methods.generateAuthToken = async function(){
	let user = this
	const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: 604800 });
	user.tokens = user.tokens.concat({token})
	await user.save()

	return token
}

userSchema.methods.toJSON = function() {
	let user = this
	let userObject = user.toObject()
	delete userObject.password
	return userObject
}

userSchema.statics.findByCredentials =  async (email, password) => {
	const user = await User.findOne({ email })
	if(!user){
		throw new Error('Unable to login1.')
	}
	const isMatch = await bcrypt.compare(password, user.password)
	if(!isMatch){
		throw new Error('Unable to login.')
	}
	return user
} 

userSchema.methods.comparePassword = function(password, cb){
	bcrypt.compare(password, this.password, function(err, isMatch){
		if(err){ return cb(null, false) }
		if(isMatch){ return cb(null, isMatch) }
	})
}  

const User = module.exports = mongoose.model('User', userSchema)
