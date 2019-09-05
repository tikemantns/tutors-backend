var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @payment_status: 1=unpaid,2=partially paid,3=fully paid
*/


var OrdersSchema = new Schema({
    order_placed_by_id: { type: Schema.Types.ObjectId, ref: 'User' },
    inventory_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
    campaign_id: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    inventory_instance: [{ instance: { type: Schema.Types.ObjectId, ref: 'InventoryInstance' }, pub_id: { type: String }} ],
    pub_id: [{ type: String }],
    status: { type: Number },
    payment: [{
        pre_tax_amount: { type: String  },
        tax: { type: String  },
        post_tax_amount: { type: String },
        discount_applied: { type: String  },
        coupoun_code: { type: String  },
        total: { type: String  },
        amount_paid: { type: String  },
        amount_remaining: { type: String  },
        payment_status: { type: Number  },
        payment_by: { type: Schema.Types.ObjectId, ref: 'User' },
        payment_on: { type: Date, default: Date.now }
    }],
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    order_placed_by_on: { type: Date, default: Date.now },
    updated_on: { type: Date }
    
});


module.exports = mongoose.model('Orders', OrdersSchema);
