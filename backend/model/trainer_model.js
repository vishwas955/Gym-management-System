const mongoose = require("mongoose");


// schema for Gym trainer
const employee_schema = mongoose.Schema({
   Emp_id:{
    type:Number,
    required:true,
    unique:true,
   },
   Username:{
    type:String,
    required:true,
    unique:true,
   },
   Password:{
    type:String,
    required:true,
   },
   First_Name:{
    type:String,
    required:true,
   },
   Last_Name:{
    type:String,
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
    dob:{
        type:Date,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    joining_date:{
        type:Date,
        required:true,
        default:Date.now,
    },
    expertise_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ExpertiseModel',
        required:true,
    },
    certification:{
        type:String,
        required:false,
    },
    experience:{
        type:Number,
        required:true,
    },
    is_admin:{
        type:Boolean,
        required:true,
    },
});

//export the employee schema
const EmployeeModel = mongoose.model("employee_model",employee_schema);
module.exports = EmployeeModel;