const mongoose = require('mongoose');

const qnaSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const QnA = mongoose.model('QnA', qnaSchema);
module.exports = QnA;
