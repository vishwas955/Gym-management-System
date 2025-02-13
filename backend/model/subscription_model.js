const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    duration: {
        type: Number, // Duration in months
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
