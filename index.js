const io = require('socket.io-client');
const fs = require('fs');
const { checkFolder } = require('./folder');
const KIOSKID = 'PTK-001';
const socket = io('http://localhost:3000');
socket.on('connect', async () => {
  socket.emit('askFiles', { kioskId: 'PTK-001' });
});

socket.on('getFiles', async (d) => {
  try {
    for (const el of Object.keys(d.kiosk)) {
      if (el === 'mediaForTopAd') {
        console.log(d.kiosk[el]);
        for (const fileInfo of d.kiosk[el]) {
          if (fileInfo.archive && fileInfo.archive) continue;
          const path = __dirname + '/files/' + d.kiosk.customId + '/' + el;
          const folder = await checkFolder(path);
          const exists = await fs.existsSync(
            path + '/' + fileInfo.fileInfo.name
          );
          if (exists) {
            await fs.unlinkSync(path + '/' + fileInfo.fileInfo.name);
          }
          if (folder) {
            fs.writeFileSync(
              path + '/' + fileInfo.fileInfo.name,
              fileInfo.chunks,
              {
                flag: 'wx',
              }
            );
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});

socket.on('error', (e) => {
  console.log(e);
});
