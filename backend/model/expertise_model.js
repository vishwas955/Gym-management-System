const mongoose = require("mongoose");

// schema for expertise of the employee
const expertise_schema = mongoose.Schema({
    expertise_id:{
        type:Number,
        required: true,
        unique: true,
    },
    expertise:{
        type:String,
        required:true,
    },
});

//Exporting expertise schema 
const ExpertiseModel = mongoose.model("expertise_model",expertise_schema);
module.exports = ExpertiseModel;