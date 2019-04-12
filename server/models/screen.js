const mongoose = require('mongoose');

const screenSchema = mongoose.Schema({
    companyName: {
        type: String,
        require: true,
        trim: true
    },
    guestsNames: {
        type: String,
        require: true,
        trim: true
    },
    date: {
        type: Number,
        require: true
    }
}, {timestamps: true});

const Screen = mongoose.model('Screen', screenSchema);

module.exports = {Screen};