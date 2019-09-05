var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @Status: 1=listed,2=available,3=purchased,4=ad content,5=review content,6=publish,7=pause,8=cancelled,9=expired,10=complete 
*/

var InventoryInstanceSchema = new Schema({
    name: { type: String, required: true, text: true },
    description: { type: String },
    inventory_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
    // ad_content_id: [{ content: { type: Schema.Types.ObjectId, ref: 'AdContent' } }], //, campaign_id: { type: String }
    ad_content_id: [{ type: Schema.Types.ObjectId, ref: 'AdContent'}],
    status: { type: Number },
    book_before_date: { type: Date },
    max_usage: { type: Number },
    created_by_id: { type: Schema.Types.ObjectId, ref: 'User' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    purchased_by: { type: Schema.Types.ObjectId, ref: 'User' },
    purchased_ad_groupid: { type: String },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date },
    campaign_id: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    pub_id: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    review_status: { type: Number },
    comment: [{
        message: { type: String },
        sender_id: { type: Schema.Types.ObjectId, ref: 'User' },
        send_on: { type: Date }
    }],

    //lit
    // issue_date: { type: Date },

    //outdor
    address: { type: String },
    area: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },

    multiple_bookings: { type: Number }
})

module.exports = mongoose.model('InventoryInstance', InventoryInstanceSchema);