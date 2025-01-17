const mongoose = require("mongoose");


// schema for Gym Member 
const gym_member_Schema = mongoose.Schema({
    gym_member_id:{
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
    username:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    first_name:{
        type:String,
        required: true,
    },
    last_name:{
        type:String,
        required:true,
    },
    gender:{
        type: String,
        required:true,
    },
    Date_of_birth:{
        type:Date,
        required:true,
    },
    contact_number:{
        type:Number,
        required:true,
        validate:{
            validator: function(v){
                return v.toString().length()===10;
            },
            message: (props) => `{props.value} is not a valid phone number!`,
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
        validate: {
          validator: async function (v) {
            // Check if the email already exists in the database
            const user = await this.constructor.findOne({ email: v });
            if (user) {
              // If the current document is being updated, ensure it's not checking against itself
              if (this._id && this._id.equals(user._id)) {
                return true;
              }
              return false;
            }
            return true;
          },
          message: "Email already exists!",
        },
    },
    address:{
        type:String,
        required:true,
    },
    city_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CityModel',
        required:true,
    },
    state_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StateModel',
        required:true,
    },
    height:{
        type:Number,
        required:true,
    },
    weight:{
        type:Number,
        required:true,
    },
    membership_status:{
        type:String,
        required:true,
        default:"Active",
    },
});

const UserModel = mongoose.model("gym_member_model",gym_member_Schema);
module.exports = UserModel;