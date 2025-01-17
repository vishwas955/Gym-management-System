const mongoose = require("mongoose");

// schema for State that contains state_id and state name 
const city_schema = mongoose.Schema({
    city_id:{
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
    city_name:{
        type:String,
        required:true,
        unique:true,
    },
    state_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

//exporting the state schema 
const CityModel = mongoose.model("City_model",city_schema);
module.exports = CityModel;