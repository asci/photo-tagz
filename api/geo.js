const rp = require('request-promise');
const { geoKey } = require('../config');

function getTags(latitude, longitude) {
  return rp({
    json: true,
    uri: 'http://api.opencagedata.com/geocode/v1/json?q=' + latitude + ',' + longitude + '&no_annotations=1&key=' + geoKey
  })
  .then((data) => {
    return [
      data.results[0].components.city,
      data.results[0].components.country,
      data.results[0].components.suburb,
      data.results[0].components.village,
      data.results[0].components.town,
      data.results[0].components.state_district,
      data.results[0].components[data.results[0].components._type]
    ];
  });
}

module.exports = {
  getTags
};
