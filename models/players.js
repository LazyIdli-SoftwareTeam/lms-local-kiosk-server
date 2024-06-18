const mongoose = require('mongoose');

const players = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model('players', players);
