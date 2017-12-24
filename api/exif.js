const exiftool = require('node-exiftool');

function createClient() {
  const ep = new exiftool.ExiftoolProcess();
  return ep.open().then(() => ep);
}

function setTagsAndCaption(ep, filename, data) {
  return ep.writeMetadata(filename, {
    'Keywords': data.tags,
    'ObjectName': data.caption,
    'Caption-Abstract': data.caption
  }, ['overwrite_original']);
}

function getMetadata(ep, filename) {
  return ep.readMetadata(filename, ['n']);
}

module.exports = {
  createClient,
  setTagsAndCaption,
  getMetadata
};
