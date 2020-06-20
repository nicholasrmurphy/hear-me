const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const causeSchema = new Schema( {
    name: {
        type: String,
        required: true
    },
    mailToSubject: {
        type: String,
        required: true
    },
    mailToBody: {
        type: String,
        required: true
    },
    aboutTheCause: {
        type: String,
        required: true
    },
    timesSupported : {
        type: Number,
        required: false,
        default: 0
    }
});

const Cause = mongoose.model('Cause', causeSchema);

module.exports = Cause;