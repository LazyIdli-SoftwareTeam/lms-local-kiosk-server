const fs = require('fs');
const { checkFolder } = require('./folder');
const createFile = async (d, config, fileInfo, key) => {
  const path = __dirname + '/files/' + d[config].customId + '/' + key;
  const folder = await checkFolder(path);
  const exists = await fs.existsSync(path + '/' + fileInfo.fileInfo.name);
  if (exists) {
    await fs.unlinkSync(path + '/' + fileInfo.fileInfo.name);
  }
  console.log(exists);
  if (folder) {
    fs.writeFileSync(path + '/' + fileInfo.fileInfo.name, fileInfo.chunks, {
      flag: 'wx',
    });
  }
};
module.exports.kioskConfig = async (d, config) => {
  for (const el of Object.keys(d[config])) {
    if (el === 'mediaForTopAd') {
      const publishedFiles = [];
      for (const fileInfo of d[config][el]) {
        if (fileInfo.archive && fileInfo.archive) return;
        await createFile(d, config, fileInfo, el);
        publishedFiles.push(fileInfo.fileInfo.name);
      }
      console.log(publishedFiles);
      const dirPath = __dirname + '/files/' + d[config].customId + '/' + el;
      fs.readdir(dirPath, async (err, files) => {
        if (err) console.log(err);
        for (const file of files) {
          if (!publishedFiles.includes(file)) {
            console.log('here', file);
            await fs.unlinkSync(dirPath + '/' + file);
          }
        }
      });
    }
  }
};
