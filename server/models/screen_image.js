const mongoose = require('mongoose');

const screenImageSchema = mongoose.Schema({
  companies: [{
    type: String,
    require: true,
    trim: true
  }],
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

const ScreenImage = mongoose.model('ScreenImage', screenImageSchema);

module.exports = {ScreenImage};