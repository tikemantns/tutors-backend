var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var MenuSchema = new Schema({
    type: { type: Number },
    menu: [{ name: { type: String }, path: { type: String } }]
})

module.exports = mongoose.model('Menu', MenuSchema);