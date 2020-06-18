const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');



let course = new Schema({
    name: { type: String, required: true, index: true },
    active: { type: Number},
    added_by: { type: String},
    added_on: { type: String},
    updated_on: { type: String}
},{
    timestamps: true
});

course.plugin(mongoosePaginate);


module.exports = mongoose.model('Course', course);