const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


const question = new Schema({}, { strict: false },{
    timestamps: true
});

question.plugin(mongoosePaginate);

module.exports = mongoose.model('Question', question);