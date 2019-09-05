var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @status: 1=created, 2=started, 3=pause, 4=cancelled, 5=completed
 * @tags: ['example1', 'example2']
 * @type: 1=litrature, 2=outdoor, 3=event
*/

var CampaignSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true  },
    budget: { type: String },
    tags: { type: [ String ]  },
    status: { type: Number },
    type: { type: Number },
    payment_id: { type: String },
    order_id: { type: Schema.Types.ObjectId, ref: 'Orders' },
    created_by_id: { type: Schema.Types.ObjectId, ref: 'User' },
    advertiser_group_id: { type: String },
    inventory_instance: [{ instance: { type: Schema.Types.ObjectId, ref: 'InventoryInstance' }} ],
    attached_file: [{
        name: { type: String },
        url: { type: String },
        file_uploaded_by: { type: Schema.Types.ObjectId, ref: 'User' },
        file_uploaded_on: { type: Date, default: Date.now }
    }],
    added_url: [{
        url_link: { type: String },
        url_added_by: { type: Schema.Types.ObjectId, ref: 'User' },
        url_added_on: { type: Date, default: Date.now }
    }],
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date }
});


module.exports = mongoose.model('Campaign', CampaignSchema);

//Attachment and url are pending
//Remove attached file and urls