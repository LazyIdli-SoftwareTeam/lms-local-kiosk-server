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
      for (const fileInfo of d[config][el]) {
        if (fileInfo.archive && fileInfo.archive) return;
        await createFile(d, config, fileInfo, el);
      }
    }
  }
};
