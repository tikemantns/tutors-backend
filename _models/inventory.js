var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

/**
 * @status: 1=created,2=started,3=pause,4=cancelled,5=completed
 * @tags: ['example1', 'example2']
*/

var InventorySchema = new Schema({
    
    name: { type: String, required: true, text: true},
    description: { type: String, required: true, text: true },
    category: { type: Number, required: true },
    status: { type: Number, required: true },
    tags: { type: [String], required: true, text: true },
    publisher_id: { type: String },
    creator_id: { type: Schema.Types.ObjectId, ref: 'User'},
    target_audience: { type: [ String ], required: true },
    reach: { type: Number, required: true },
    price: { type: String, required: true },
    inventory_instance: [{ instance: { type: Schema.Types.ObjectId, ref: 'InventoryInstance' }} ],    // inventory_instance: { type: [Schema.Types.ObjectId], ref: 'InventoryInstance' },
    comment: [{ 
        message: { type: String }, 
        sender_id: { type: Schema.Types.ObjectId, ref: 'User' },
        send_on: { type: Date } 
    }],
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date },
    date: { type: Date }
});

module.exports = mongoose.model('Inventory', InventorySchema);

// InventorySchema = mongoose.model('InventoryModel', InventorySchema);
// // module.exports = mongoose.model('InventoryInstanceModel', InventoryInstanceSchema);

// module.exports = {
//     InventorySchema: InventorySchema,
//     // InventoryInstanceModel: InventoryInstanceSchema
// }