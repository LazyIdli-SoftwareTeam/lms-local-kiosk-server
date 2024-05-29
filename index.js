const io = require('socket.io-client');
const express = require('express');
const app = express();
const fs = require('fs');
const fileUpload = require('express-fileupload');
const socket = io('http://localhost:3000');
socket.on('connect', () => {
  console.log('socket connected');
});
socket.on('error', (e) => {
  console.log(e);
});
app.use(fileUpload());
const checkFolder = async (path) => {
  try {
    const existPath = fs.existsSync(path);
    if (!existPath) {
      const dir = await fs.mkdirSync(path, { recursive: true });
      return dir;
    } else {
      return existPath;
    }
  } catch (e) {
    return false;
  }
};

socket.on('file', async (d) => {
  try {
    let newpath = __dirname + '/files/';
    const file = d.file;
    const filename = file.name;
    newpath += d.kioskId + '/';
    newpath += d.section + '/';
    let fileExist = await checkFolder(newpath);
    if (!fileExist)
      return res.status(500).json({ message: 'Some error occurred' });
    await fs.writeFileSync(newpath + filename, file.data);
    socket.emit('fileStatus', {
      kioskId: d.kioskId,
      fileName: filename,
      status: 'uploaded',
    });
  } catch (e) {
    console.log(e);
    socket.emit('fileStatus', {
      kioskId: d.kioskId,
      fileName: filename,
      status: 'uploaded',
    });
  }
});

app.listen(8000);
