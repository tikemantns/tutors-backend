const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


let subject = new Schema({
    name: { type: String, required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    active: { type: Number},
    added_by: { type: String},
    added_on: { type: String},
    updated_on: { type: String}
},{
    timestamps: true
});

subject.plugin(mongoosePaginate);


module.exports = mongoose.model('Subject', subject);