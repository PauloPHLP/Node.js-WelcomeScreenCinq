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
  wsType: {
    type: String,
    default: 'Image'
  }
}, {timestamps: true});

const ScreenImage = mongoose.model('ScreenImage', screenImageSchema);

module.exports = {ScreenImage};