const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    reps: {
        type: Number
    },
    sets: {
        type: Number
    },
    duration: {
        type: Number // Duration in minutes
    }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;
