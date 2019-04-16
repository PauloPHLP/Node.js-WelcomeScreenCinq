const mongoose = require('mongoose');

const screenVideoSchema = mongoose.Schema({
    videoName: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    }
}, {timestamps: true});

const ScreenVideo = mongoose.model('ScreenVideo', screenVideoSchema);

module.exports = {ScreenVideo};