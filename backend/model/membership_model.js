const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    gymMemberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

const Membership = mongoose.model('Membership', membershipSchema);
module.exports = Membership;
