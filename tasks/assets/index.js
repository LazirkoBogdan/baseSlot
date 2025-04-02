const fs = require('fs');
const path = require('path');

function makeGameAssets(config) {
  const assets = {};
  const prefix = path.posix.join(config.staticPath, '/'); // Use path.posix.join for cross-platform consistency
  const pathAssets = path.resolve(config.gameAssetsPath);
  const assetsSections = config.assetsSections;
  const ignore = config.ignore;
  const outConfig = path.resolve(config.outConfig);

  const ResourcesJson = findFiles(pathAssets, ignore, '.json');
  const ResourcesBitmap = findFiles(pathAssets, ignore, '.fnt');
  const ResourcesFont = [...findFiles(pathAssets, ignore, '.ttf'), ...findFiles(pathAssets, ignore, '.woff2')];

  const ResourcesPngFromSprites = findFilesFromSprites(pathAssets, '.png');
  const ResourcesSVGFromSprites = findFilesFromSprites(pathAssets, '.svg');

  // Function to find files based on extension type
  function findFiles(directory, ignoreFolders = [], type = '.json') {
    const foundFiles = [];

    function searchForFiles(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          if (!ignoreFolders.includes(file)) {
            searchForFiles(filePath);
          }
        } else {
          const ext = path.extname(file);
          const relativePath = path.relative(directory, filePath);

          if (ext === '.png') {
            continue; // Ignore PNG files outside the 'sprites' folder
          }

          if (ext === type) {
            const fileName = removeJsonExtension(extractWordString(filePath));
            const fileNameSplit = splitStringAtLastHyphen(fileName);
            const fileNamePartSecond = Number(fileNameSplit[1]);

            if (!fileNamePartSecond || fileNamePartSecond <= 0) {
              foundFiles.push(relativePath.split(path.sep).join('/')); // Normalize to forward slashes
            }
          }
        }
      }
    }

    searchForFiles(directory);
    return foundFiles;
  }

  // Function to find PNG files only from sprites folder
  function findFilesFromSprites(directory, type = '.png') {
    const foundFiles = [];

    function searchForFiles(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          searchForFiles(filePath);
        } else {
          const ext = path.extname(file);
          const relativePath = path.relative(directory, filePath);

          if (ext === type && relativePath.includes(path.join('sprites', '/'))) {
            foundFiles.push(relativePath.split(path.sep).join('/')); // Normalize to forward slashes
          }
        }
      }
    }

    searchForFiles(directory);
    return foundFiles;
  }

  // Utility to split string at the last hyphen
  function splitStringAtLastHyphen(inputString) {
    const lastIndex = inputString.lastIndexOf('-');

    if (lastIndex !== -1) {
      const part1 = inputString.substring(0, lastIndex);
      const part2 = inputString.substring(lastIndex + 1);
      return [part1, part2];
    } else {
      return [inputString];
    }
  }

  // Utility to remove specific hyphens (e.g., '-screen')
  function removeHyphens(inputString) {
    return inputString.replace(/-screen/g, '');
  }

  // Populating assets object with sections and files
  assets['id'] = config.id;
  assetsSections.forEach((section) => {
    if (assets[section] === undefined) {
      const cleanSection = removeHyphens(section);
      assets[cleanSection] = ResourcesJson.filter((resource) => resource.includes(section)).map((resource) =>
        path.posix.join(prefix, resource.split(path.sep).join('/')),
      );
    }
  });

  // Translation handling
  const translation = 'translation';
  const translationRes = ResourcesJson.filter((resource) => resource.includes(translation)).map((resource) =>
    path.posix.join(prefix, resource.split(path.sep).join('/')),
  );
  if (translationRes.length > 0) {
    const translatePath = replaceEnWithReplaceNumber(translationRes[0]);
    assets['translation'] = translatePath;
  }

  // Font handling
  assets['fonts'] = [
    ...ResourcesBitmap.map((resource) => path.posix.join(prefix, resource.split(path.sep).join('/'))),
    ...ResourcesFont.map((resource) => path.posix.join(prefix, resource.split(path.sep).join('/'))),
  ];

  // Handle sprite PNG files
  ResourcesPngFromSprites.forEach((resource) => {
    const section = assetsSections.find((sec) => resource.includes(path.join('sprites', sec, '/')));
    if (section) {
      if (!assets[section]) {
        assets[section] = [];
      }
      const fileName = path.basename(resource, '.png'); // Get the base file name without extension
      assets[section].push({ name: fileName, src: path.posix.join(prefix, resource.split(path.sep).join('/')) });
    }
  });

  ResourcesSVGFromSprites.forEach((resource) => {
    const section = assetsSections.find((sec) => resource.includes(path.join('sprites', sec, '/')));
    if (section) {
      if (!assets[section]) {
        assets[section] = [];
      }

      const fileName = path.basename(resource, '.svg'); // Get the base file name without extension
      assets[section].push({ name: fileName, src: path.posix.join(prefix, resource.split(path.sep).join('/')) });
      console.log(assets);
    }
  });

  // Write assets configuration to the output file
  return new Promise((res, rej) => {
    console.log(`Assets Config creating`, assets);
    fs.writeFileSync(outConfig, JSON.stringify(assets, null, 2)); // Write the configuration to a JSON file
    console.log(`Assets Config created`);
    res();
  });
}

// Utility to remove .json extension from file names
function removeJsonExtension(inputString) {
  return inputString.replace(/\.json$/, '');
}

// Utility to replace 'en' with 'replace#' in translation paths
function replaceEnWithReplaceNumber(input) {
  const regex = /en/g;
  return input.replace(regex, 'replace#');
}

// Utility to extract words from a path
function extractWordString(inputString, sing = '-', length = 1) {
  const parts = inputString.split(path.sep);
  if (parts.length < length) {
    return '';
  }
  return parts[parts.length - length];
}

module.exports = { makeGameAssets };
