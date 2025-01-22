const { Transaction } = require("mongodb");
const mongoose = require("mongoose");

// schema for payment details of the gym member that contains payment details of every member 

const paymentSchema = new mongoose.Schema({
    transaction_id:{
        type:Number,
        required:true,
        unique:true
    },
    gym_member_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "GymMember", 
        required: true 
    },
    payment_date: { 
        type: Date, 
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
  });

//Exporting the payment table
const Payment = mongoose.model("Payment",payment_schema);
module.exports = Payment;