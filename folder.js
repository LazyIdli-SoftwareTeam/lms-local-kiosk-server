const fs = require('fs');
module.exports.checkFolder = async (path) => {
  try {
    const existPath = fs.existsSync(path);
    console.log(existPath);
    if (!existPath) {
      const dir = await fs.mkdirSync(path, { recursive: true });
      return dir;
    } else {
      return existPath;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

