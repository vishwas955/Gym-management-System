const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    feedbackText: {
        type: String,
        required: true
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
