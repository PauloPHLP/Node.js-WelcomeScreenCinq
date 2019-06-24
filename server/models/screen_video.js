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
  startDate: {
    type: String,
    require: true
  },
  endDate: {
    type: String,
    require: true
  },
  activated: {
    type: String,
    default: "true"
  },
  isDefaultVideo: {
    type: Boolean,
    default: false
  },
  wsType: {
    type: String,
    default: 'Video'
  }
}, {timestamps: true});

const ScreenVideo = mongoose.model('ScreenVideo', screenVideoSchema);

module.exports = {ScreenVideo};