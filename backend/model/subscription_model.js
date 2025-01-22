const mongoose = require("mongoose");

// schema for subscription of gym member that contains subscription details of the gym member 
const subscriptionSchema = new mongoose.Schema({
    subscription_id: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    subscription_name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    details: { 
        type: String, 
        required: true 
    },
    duration_months: { 
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
  });

//exporting subscription model schema 
const Subscription = mongoose.model('Subscription',subscription_schema);
module.exports = Subscription;