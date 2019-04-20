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
        type: String,
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

screenVideoSchema.methods.deleteOne = function(id) {
    ScreenVideo.findByIdAndRemove(id);
}

screenVideoSchema.methods.updateOne = function(id, screenVideo) {
    const updatedScreenVideo = {
        title: screenVideo.title,
        videoName: screenVideo.videoName,
        defaultVideoName: screenVideo.defaultVideoName,
        date: screenVideo.date,
        activated: screenVideo.activated,
        wsType: screenVideo.wsType
    }

    ScreenVideo.updateOne(id, updatedScreenVideo, {new: true});
}

const ScreenVideo = mongoose.model('ScreenVideo', screenVideoSchema);

module.exports = {ScreenVideo};