const mongoose = require("mongoose");

// schema for State that contains state_id and state name 
const state_schema = mongoose.Schema({
    state_id:{
        type:Number,
        validate:{
            validator: function(value){
                return value >=1000 && value <= 9999;   // checking if it is 4 digit 
            },
            message:" Field must be 4 digit",
        },
        required: true,
        unique: true,
    },
    state_name:{
        type:String,
        required:true,
        unique:true,
    },
});

//exporting the state schema 
const StateModel = mongoose.model("state_model",state_schema);
module.exports = StateModel;