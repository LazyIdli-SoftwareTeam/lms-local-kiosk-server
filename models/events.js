const mongoose = require('mongoose');

const Event = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model('event', Event);
