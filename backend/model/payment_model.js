const mongoose = require("mongoose");

// schema for payment details of the gym member that contains payment details of every member 

const payment_schema = mongoose.Schema({
    payment_id:{
        type:Number,
        required:true,
        unique:true,
    },
    gym_member_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
        required:true,
    },
    payment_date:{
        type:Date,
        required:true,
        default:Date.now,
    },
    payment_amt:{
        type:Number,
        required:true,
    },
    payment_method:{
        type:String,
        required:true,
        enum:["Online/UPI","UPI","Cash"],
        default:"Cash",
    },
    payment_status:{
        type:String,
        required:true,
        default:"Failed",
    },
});

//Exporting the payment table
const PaymentModel = mongoose.model("payment_model",payment_schema);
module.exports = PaymentModel;