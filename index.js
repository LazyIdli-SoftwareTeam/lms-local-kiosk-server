const io = require('socket.io-client');
const fs = require('fs');
const express = require('express');
const app = express();
let config = require('./config.json');
const cors = require('cors');
const { kioskConfig } = require('./file');
// const LMS_BACKEND_LINK = 'http://13.232.172.215:3001/';
const LMS_BACKEND_LINK = 'http://localhost:3001/';
const KIOSK_ID = 'PTK-001';
var cron = require('node-cron');
const socket = io(LMS_BACKEND_LINK);
const server = require('http').createServer(app);
const ioo = require('socket.io')(server, { cors: { origin: '*' } });
  cron.schedule('*/2 * * * *', () => {
    console.log('sjnw')
  })
socket.on('connect', async () => {
  console.log('asking for files');
  socket.emit('askFiles', { kioskId: KIOSK_ID });
  console.log('connected');
  cron.schedule('*/2 * * * *', () => {
    if (!socket.connected) return; 
    console.log('asking for files');
    socket.emit('askFiles', { kioskId: KIOSK_ID });
  });
});

socket.on('error', (e) => {
  console.log(e);
});

// dns.resolve('google.com', (err, add) => {
//   if (err) return;
//   connect();
// });

socket.on('getFiles', async (d) => {
  try {
    
    if (d.kiosk.customId != KIOSK_ID) return console.log('incorrect id'); 
    console.log('got files', d);
    await kioskConfig(d, 'kiosk', ioo);
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

server.listen(4700, () => {
  console.log('socket are working');
});
