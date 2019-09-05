var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CouponSchema = new Schema({
    coupon_code: { type: String },
    coupon_desp: { type: String },
    coupon_value: { type: Number },
    coupon_usage: { type: Number },
    no_time_allowed: { type: Number },
    coupon_status: { type: Number },
    min_amount: { type: Number }
})

module.exports = mongoose.model('Coupon', CouponSchema);