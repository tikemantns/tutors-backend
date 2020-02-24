const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let footer = new Schema({
    _id: Schema.Types.ObjectId,
    heading: {},
},{
    timestamps: true
});

module.exports = mongoose.model('Footer', footer);