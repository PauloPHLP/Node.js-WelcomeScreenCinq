const mongoose = require('mongoose');

const screenImageSchema = mongoose.Schema({
    company: {
        type: String,
        require: true,
        trim: true
    },
    guestsNames: [],
    imageName: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    activated: {
        type: String,
        default: 'Enabled'
    }
}, {timestamps: true});

const ScreenImage = mongoose.model('ScreenImage', screenImageSchema);

module.exports = {ScreenImage};