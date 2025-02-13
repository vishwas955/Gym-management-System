const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    seven_days: {
        type: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]], // Array of exercise arrays
        required: true
    }
});

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
module.exports = WorkoutPlan;
