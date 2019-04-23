const mongoose = require('mongoose');

const screenImageSchema = mongoose.Schema({
    company: {
        type: String,
        require: true,
        trim: true
    },
    guestsNames: [{
        type: String
    }],
    imageName: {
        type: String,
        require: true
    },
    defaultImageName: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: Date.now,
        require: true
    },
    activated: {
        type: Boolean,
        default: true
    },
    wsType: {
        type: String,
        default: 'Image'
    }
}, {timestamps: true});

screenImageSchema.methods.deleteOne = function(id) {
    ScreenImage.findByIdAndRemove(id);
}

screenImageSchema.methods.updateOne = function(id, screenImage) {
    let updatedScreenImage = {
        company: screenImage.company,
        imageName: screenImage.imageName,
        defaultImageName: screenImage.defaultImageName,
        date: screenImage.date,
        activated: screenImage.activated,
        wsType: screenImage.wsType
    }
    
    ScreenImage.updateOne(id, updatedScreenImage);
}

const ScreenImage = mongoose.model('ScreenImage', screenImageSchema);

module.exports = {ScreenImage};