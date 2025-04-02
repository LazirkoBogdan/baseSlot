const fs = require('fs');
const path = require('path');
const { makeAtlas } = require('./commands');

function makePackImages(config) {
  const configsAtlas = [];
  const atlasFolderPath = path.resolve(config.atlas.atlasFolderPath);
  const imageFolderPath = path.resolve(config.atlas.imageFolderPath);

  // Safely check if folder exists before attempting to delete it
  if (fs.existsSync(atlasFolderPath)) {
    fs.rmSync(atlasFolderPath, { recursive: true, force: true });
    console.log('Folder atlas deleted');
  } else {
    console.log('Folder atlas does not exist, skipping deletion');
  }
  console.log('---------------------------');

  const folders = fs.readdirSync(imageFolderPath);

  folders.forEach((folder) => {
    configsAtlas.push({
      name: folder,
      dataPath: path.join(atlasFolderPath, folder),
      dataPathFrom: path.join(imageFolderPath, folder),
      format: config.atlas.typeJPG.includes(folder) ? 'jpg' : 'png',
    });
  });

  configsAtlas.forEach((config) => {
    makeAtlas(config);
    console.log('---------------------------');
  });

  return Promise.resolve();
}

module.exports = { makePackImages };
