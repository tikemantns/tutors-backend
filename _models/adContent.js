var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AdContentSchema = new Schema({
    // inventroy_instance_id: { type: Schema.Types.ObjectId, ref: 'InventoryInstance' },
    // attached_files_url: { type: String },
	// file_type: { type: String },
    // url: { type: String },
    // file_uploaded_by: { type: Schema.Types.ObjectId, ref: 'User' },
    // file_uploaded_on: { type: Date },
    // url_added_by: { type: Schema.Types.ObjectId, ref: 'User' },
    // url_added_on: { type: Date },
    // ad_content_created_on: { type: Date, default: Date.now },
    // ad_content_updated_on: { type: Date }

    inventory_instance_id: { type: Schema.Types.ObjectId, ref: 'InventoryInstance' },
    campaign_id: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    status: { type: Number },
    attached_files: [{
        name: { type: String },
        url: { type: String },
        file_uploaded_by: { type: Schema.Types.ObjectId, ref: 'User' },
        file_uploaded_on: { type: Date }
    }],
    add_url: [{ 
        url_link: { type: String },
        url_added_by: { type: Schema.Types.ObjectId, ref: 'User' },
        url_added_on: { type: Date }
    }],
    ad_created_by: { type: String },
    ad_content_created_on: { type: Date, default: Date.now },
    ad_content_updated_on: { type: Date }
});

module.exports = mongoose.model('AdContent', AdContentSchema);