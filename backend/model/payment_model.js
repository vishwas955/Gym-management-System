const mongoose = require("mongoose");

// schema for payment details of the gym member that contains payment details of every member 

const paymentSchema = new mongoose.Schema({
    transaction_id:{
        type: String, 
        required:true,
        unique: true
    },
    plan_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subscription",
        required:true
    },
    gym_member_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    method: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Completed","Failed"], 
        required: true 
    },
  },{timestamps:true});

//Exporting the payment table
const Payment = mongoose.model("Payment",paymentSchema);
module.exports = Payment;