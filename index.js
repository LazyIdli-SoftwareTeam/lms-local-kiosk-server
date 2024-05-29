const io = require('socket.io-client');
const fs = require('fs');
const { default: simpleGit } = require('simple-git');
const socket = io('http://localhost:3000');
socket.on('connect', async () => {
  try {
    const git = simpleGit();
    await git.init();
    const latest = (await git.log()).latest.hash;
    const data = await fs.readFileSync('commit');
    if (data.length <= 0 || data != latest) {
      console.log('pulling');
      git.pull();
      await fs.writeFileSync('commit', latest);
    }
  } catch (e) {
    console.log(e);
  }
});

socket.on('error', (e) => {
  console.log(e);
});
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


//here is the new comment that i added
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
