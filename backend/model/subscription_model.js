const mongoose = require("mongoose");

// schema for subscription of gym member that contains subscription details of the gym member 
const subscription_schema = mongoose.Schema({
    sub_id:{
        type:Number,
        required:true,
        unique:true,
    },
    sub_name:{
        type:String,
        required:true,
    },
    sub_details:{
        type:String,
        required:true,
    },
    months:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
});

//exporting subscription model schema 
const SubscriptionModel = mongoose.model('subscription_model',subscription_schema);
module.exports = SubscriptionModel;