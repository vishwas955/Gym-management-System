const mongoose = require("mongoose");

// schema for the membership of the gym member that contains subscription info of the gym member  
const membership_schema = mongoose.Schema({
    membership_id:{
        type:Number,
        required:true,
        unique:true,
    },
    gym_member_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
        required:true,
        unique:true,
    },
    sub_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubscriptionModel',
        reuired:true,
    },
    start_date:{
        type:Date,
        required:true,
        default:Date.now,
    },
    end_date:{
        type:Date,
        required:true,
    },
});

//Exporting the schema of the membership table
const MembershipModel = mongoose.model('membership_model',membership_schema);
module.exports = MembershipModel;