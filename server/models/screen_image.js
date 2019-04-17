const mongoose = require('mongoose');

const screenImageSchema = mongoose.Schema({
    companyName: {
        type: String,
        require: true,
        trim: true
    },
    guestsNames: {
        type: [String],
        require: true,
        trim: true
    },
    imageName: {
        type: String,
        require: true
    },
    wsType: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    }
}, {timestamps: true});

const ScreenImage = mongoose.model('ScreenImage', screenImageSchema);

module.exports = {ScreenImage};