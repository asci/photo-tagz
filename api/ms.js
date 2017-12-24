const rp = require('request-promise');
const { msKey } = require('../config');

function getTags(buffer) {
  return getImageInfo(buffer, 'tag')
    .then(json => json.tags.map(tag => tag.name));
}

function getDescribe(buffer) {
  return getImageInfo(buffer, 'describe')
    .then(json => {
      const caption = json.description.captions[0].text;
      return {
        tags: json.description.tags,
        caption
      };
    });
}

function getImageInfo(buffer, type) {
  return rp({
    json: true,
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': msKey
    },
    uri: 'https://westus.api.cognitive.microsoft.com/vision/v1.0/' + type,
    multipart: [
      {
        'content-type': 'application/octet-stream',
        body: buffer
      }
    ]
  });
}

module.exports = {
  getTags,
  getDescribe
}
