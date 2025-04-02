const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths to the base folders
const folderPath = 'public/assets/atlas';
const spineFolder = 'public/assets/animation';

// AVIF quality setting (from 1 to 100)
const quality = 80; // For example, 80

/**
 * Recursive function to traverse directories and process image files.
 * @param {string} folder - The current directory to process.
 * @param {string} updateType - Type of update: 'json' for atlas (JSON files) or 'atlas' for Spine animations (.atlas files)
 */
function processFolder(folder, updateType) {
    fs.readdir(folder, { withFileTypes: true }, (err, items) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        items.forEach(item => {
            const fullPath = path.join(folder, item.name);

            if (item.isDirectory()) {
                // Recursively process subdirectories
                processFolder(fullPath, updateType);
            } else if (item.isFile()) {
                const ext = path.extname(item.name).toLowerCase();
                // Process image files with extensions .png, .jpg, .jpeg
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                    const outputFileName = path.basename(item.name, ext) + '.avif';
                    const outputPath = path.join(folder, outputFileName);

                    sharp(fullPath)
                        .avif({ quality: quality })
                        .toFile(outputPath)
                        .then(() => {
                            console.log(`Converted ${fullPath} to ${outputPath} with quality ${quality}`);

                            // If updateType is "json" – update the corresponding JSON file (atlas)
                            if (updateType === 'json') {
                                const jsonFilePath = path.join(folder, path.basename(item.name, ext) + '.json');
                                if (fs.existsSync(jsonFilePath)) {
                                    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
                                        if (err) {
                                            console.error('Error reading JSON file:', jsonFilePath, err);
                                            return;
                                        }
                                        try {
                                            let jsonContent = JSON.parse(data);
                                            if (jsonContent.meta && jsonContent.meta.image) {
                                                // Replace the extension from .png/.jpg/.jpeg to .avif
                                                jsonContent.meta.image = jsonContent.meta.image.replace(/\.(png|jpe?g)$/i, '.avif');
                                            }
                                            fs.writeFile(jsonFilePath, JSON.stringify(jsonContent, null, 2), 'utf8', (err) => {
                                                if (err) {
                                                    console.error('Error updating JSON file:', jsonFilePath, err);
                                                } else {
                                                    console.log(`Updated JSON file ${jsonFilePath}`);
                                                }
                                            });
                                        } catch (e) {
                                            console.error('Error parsing JSON file:', jsonFilePath, e);
                                        }
                                    });
                                }
                            }
                            // If updateType is "atlas" – update the .atlas file (Spine)
                            else if (updateType === 'atlas') {
                                const atlasFilePath = path.join(folder, path.basename(item.name, ext) + '.atlas');
                                if (fs.existsSync(atlasFilePath)) {
                                    fs.readFile(atlasFilePath, 'utf8', (err, data) => {
                                        if (err) {
                                            console.error('Error reading atlas file:', atlasFilePath, err);
                                            return;
                                        }
                                        const updatedData = data
                                            .split('\n')
                                            .map(line => {
                                                // If the line does not contain ":" and contains an image file reference, update its extension
                                                if (!line.includes(':') && line.trim().match(/\.(png|jpe?g)$/i)) {
                                                    return line.replace(/\.(png|jpe?g)$/i, '.avif');
                                                }
                                                return line;
                                            })
                                            .join('\n');
                                        fs.writeFile(atlasFilePath, updatedData, 'utf8', (err) => {
                                            if (err) {
                                                console.error('Error updating atlas file:', atlasFilePath, err);
                                            } else {
                                                console.log(`Updated atlas file ${atlasFilePath}`);
                                            }
                                        });
                                    });
                                }
                            }
                        })
                        .catch(err => {
                            console.error('Error converting file:', fullPath, err);
                        });
                }
            }
        });
    });
}

// Process both folders
processFolder(folderPath, 'json');   // Process the atlas folder – update JSON files
processFolder(spineFolder, 'atlas');   // Process the Spine animations folder – update .atlas files