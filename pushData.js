const mongoose = require('mongoose');
const link = 'http://192.168.8.159:8800/uploadData';
const events = require('./models/events');
const axios = require('axios');
const players = require('./models/players');
module.exports.connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/templms');
    const scores = await events.find({});
    const player = await players.find({});
    const response = await axios.post(link, {
      scores: scores,
      players: player,
      headers: { 'Content-Type': 'application/json' },
    });
    mongoose.connection.close(); 
  } catch (e) {
    mongoose.connection.close();
  }
};
