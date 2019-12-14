const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let menu = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true, index: true },
    active: { type: Number},
    submenu: {}
},{
    timestamps: true
});


 

module.exports = mongoose.model('Menu', menu);