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
    defaultImageName: {
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
        default: 'Image'
    }
}, {timestamps: true});

screenImageSchema.methods.deleteOne = function(id) {
    ScreenImage.findByIdAndRemove(id);
}

const ScreenImage = mongoose.model('ScreenImage', screenImageSchema);

module.exports = {ScreenImage};