const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    electionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
    },
    photoPath: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;
