const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    exercise_id:{
        type:String,
        required:true,
        unique:true
    },
    plan_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "WorkoutPlan", 
        required: true 
    },
    exercise_name: { 
        type: String, 
        required: true 
    },
    reps: { 
        type: Number
    },
    sets: { 
        type: Number
    },
    duration_minutes: { 
        type: Number
    },
  });
  const Exercise = mongoose.model("Exercise", exerciseSchema);
  module.exports = Exercise;