const fs = require('fs');
const { checkFolder } = require('./folder');
const createFile = async (d, config, fileInfo, key) => {
  const path = __dirname + '/files/' + d[config].customId + '/' + key;
  const folder = await checkFolder(path);
  const exists = await fs.existsSync(path + '/' + fileInfo.fileInfo.name);
  if (exists) {
    await fs.unlinkSync(path + '/' + fileInfo.fileInfo.name);
  }
  if (folder) {
    await fs.writeFileSync(
      path + '/' + fileInfo.fileInfo.name,
      fileInfo.chunks,
      {
        flag: 'wx',
      }
    );
  }
};

const deleteInstructionVideo = async (kisokId) => {
  const path = __dirname + '/files/' + kisokId + '/instructionVideo';
  const exists = await fs.existsSync(path);
  if (exists) {
    const files = await fs.readdirSync(path);
    for (const file of files) {
      await fs.unlinkSync(path + '/' + file);
    }
  }
};

module.exports.kioskConfig = async (d, config) => {
  for (const el of Object.keys(d[config])) {
    if (
      el === 'mediaForTopAd' ||
      el === 'mediaForBottomOffers' ||
      el === 'instructionVideo'
    ) {
      const publishedFiles = [];
      let tempO = d[config][el];
      if (el === 'instructionVideo') {
        await deleteInstructionVideo(d[config].customId);
      }
      if (!tempO) continue;
      for (const fileInfo of tempO) {
        if (fileInfo.archive) continue;
        await createFile(d, config, fileInfo, el);
        publishedFiles.push(fileInfo.fileInfo.name);
      }
      const dirPath = __dirname + '/files/' + d[config].customId + '/' + el;
      const existPath = await fs.existsSync(dirPath);
      if (!existPath) continue;
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

  const nwKiosk = { ...d };
  for (const el of Object.keys(nwKiosk.kiosk)) {
    if (
      el === 'mediaForTopAd' ||
      el === 'mediaForBottomOffers' ||
      el === 'instructionVideo'
    ) {
      if (!el || !nwKiosk.kiosk[el]) continue;
      const newTemp = nwKiosk.kiosk[el].map((e) => {
        return {
          fileName: e.fileInfo.name,
          id: e.fileInfo.id,
          archive: e.fileInfo.archive || false,
          all: e.fileInfo.all || false,
        };
      });
      nwKiosk.kiosk[el] = newTemp;
    }
  }
  console.log(nwKiosk);
  await fs.writeFileSync('config.json', JSON.stringify(nwKiosk));
};
