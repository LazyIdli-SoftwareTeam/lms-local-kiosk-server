const io = require('socket.io-client');
const fs = require('fs');
const { checkFolder } = require('./folder');
const { createFile, kioskConfig } = require('./file');
const KIOSKID = 'PTK-001';
const socket = io('http://localhost:3000');
socket.on('connect', async () => {
  socket.emit('askFiles', { kioskId: 'PTK-001' });
});

socket.on('getFiles', async (d) => {
  try {
    await kioskConfig(d, 'kiosk');
    await kioskConfig(d, 'common');
  } catch (e) {
    console.log(e);
  }
});

socket.on('error', (e) => {
  console.log(e);
});
