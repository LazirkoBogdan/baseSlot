const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function makeAtlas({ name, dataPath, dataPathFrom, format }) {
  const folder = path.resolve(dataPathFrom);
  const rgb = format === 'jpg' ? 'RGBA4444' : 'RGBA8888';

  if (!fs.existsSync(folder) || !fs.readdirSync(folder).length) {
    console.log(`>> [${name}] >>  folder is EMPTY`);
    return null;
  }

  console.log(`>> [${name}] >>  start pack to atlas`);

  // Use cross-platform command execution
  const texturePackerCommand = 'TexturePacker';

  try {
    execSync(
      'TexturePacker' +
        ` --data ${dataPath}/${name}-{n}.json` +
        ` --texture-format ${format}` +
        ' --max-height 4096' +
        ' --max-width 4096' +
        ' --prepend-folder-name' +
        ' --format pixijs4' +
        ' --multipack' +
        ' --trim-mode Trim' +
        ' --extrude 1' +
        ' --algorithm MaxRects' +
        ` --opt ${rgb}` +
        ' --scale 1' +
        ' --trim-sprite-names' +
        ' --disable-auto-alias' +
        ` ${dataPathFrom}`,
    );
    console.log(`>> [${name} ${format}] >>  textures packed in atlas`);
  } catch (error) {
    console.error(`Failed to execute TexturePacker for [${name}]:`, error);
  }
}

module.exports = { makeAtlas };
