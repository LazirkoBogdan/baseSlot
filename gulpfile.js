const gulp = require('gulp');
const gulpConfig = require('./gulp-setting.json');
const { series, parallel } = require('gulp');


const { makePackImages, makeGameAssets } = require('./tasks');

function packImagesTask() {
  return makePackImages(gulpConfig);
}

function gameAssetsTask() {
  return makeGameAssets(gulpConfig.assets);
}

exports.atlas = packImagesTask;
exports.assets = gameAssetsTask;


exports.default = series(parallel(packImagesTask), gameAssetsTask);
