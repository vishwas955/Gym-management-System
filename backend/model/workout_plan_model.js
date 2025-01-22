const mongoose = require("mongoose");


const workoutPlanSchema = new mongoose.Schema({
    plan_id:{
        type:Number,
        required:true,
        unique:true
    },
    plan_name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String 
    },
  });
  const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
  module.exports = WorkoutPlan;