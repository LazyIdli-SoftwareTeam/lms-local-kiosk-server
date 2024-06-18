const io = require('socket.io-client');
const fs = require('fs');
const express = require('express');
const app = express();
let config = require('./config.json');
const { checkFolder } = require('./folder');
const cors = require('cors');
const { createFile, kioskConfig } = require('./file');
const KIOSKID = 'PTK-001';
const socket = io('http://localhost:3000');
socket.on('connect', async () => {
  setInterval(() => {
    console.log('asking for files');
    socket.emit('askFiles', { kioskId: 'PTK-001' });
  }, 10000);
});

socket.on('getFiles', async (d) => {
  try {
    await kioskConfig(d, 'kiosk');
  } catch (e) {
    console.log(e);
  }
});
app.use(express.json());
app.use(cors());
app.use(express.static('files'));
app.get('/links', async (req, res) => {
  try {
    let data = await fs.readFileSync('config.json');
    config = JSON.parse(data);
    const nwKiosk = { ...config };
    nwKiosk.kiosk.mediaForTopAd = nwKiosk.kiosk.mediaForTopAd.filter(
      (e) => !e.archive
    );
    nwKiosk.kiosk.mediaForBottomOffers =
      nwKiosk.kiosk.mediaForBottomOffers.filter((e) => !e.archive);

    return res.status(200).json({ message: 'Done!', data: nwKiosk });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Some error occurred' });
  }
});

socket.on('error', (e) => {
  console.log(e);
});

app.listen(3300, () => {
  console.log('app is working on port 3300');
});
