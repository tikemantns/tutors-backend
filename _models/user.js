var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

/**
 * @type: 1=Publisher,2=Advertiser
*/

var UserSchema = new Schema({
    name: { type: String, required: true, text: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    address: { type: String },
    type: { type: String },
    admin_rights: { type: String },
    password: { type: String, required: true },
    group_id: { type: String },
    loggedIn_at: { type: Date },
    loggedOut_at: { type : Date },
    createdAt: { type : Date, default: Date.now },
    updatedAt: { type : Date }
});


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
