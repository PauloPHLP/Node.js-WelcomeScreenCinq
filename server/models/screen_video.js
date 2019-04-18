const mongoose = require('mongoose');

const screenVideoSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    videoName: {
        type: String,
        require: true
    },
    defaultVideoName: {
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
    },
    wsType: {
        type: String,
        default: 'Video'
    }
}, {timestamps: true});

const ScreenVideo = mongoose.model('ScreenVideo', screenVideoSchema);

module.exports = {ScreenVideo};