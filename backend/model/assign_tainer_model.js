const mongoose = require("mongoose");

// schema for assigning the trainer to the gym member 
const assign_trainer_schema = mongoose.Schema({
    assign_trainer_id:{
        type:Number,
        required:true,
        unique:true,
    },
    gym_member_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
        required:true,
    },
    Emp_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EmployeeModel',
        required:true,
    },
});

//Exporting the assigned trainer schema 
const AssignTrainerModel = mongoose.model("Assign_Trainer_Model",assign_trainer_schema);
module.exports = AssignTrainerModel;