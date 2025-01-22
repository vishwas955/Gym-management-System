const mongoose = require("mongoose");

// schema for the membership of the gym member that contains subscription info of the gym member  
const membershipSchema = new mongoose.Schema({
    membership_id:{
        type:Number,
        required:true,
        unique:true
    },
    gym_member_id_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "GymMember", 
        required: true 
    },
    subscription_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subscription", 
        required: true 
    },
    start_date: { 
        type: Date, 
        required: true,
        default:Date.now
    },
    end_date: { 
        type: Date, 
        required: true 
    },
  });

//Exporting the schema of the membership table
const Membership = mongoose.model('Membership',membership_schema);
module.exports = Membership;