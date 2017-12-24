const Clarifai = require('clarifai');
const { clariClientId, clariClientSecret } = require('../config');

const app = new Clarifai.App(
  clariClientId,
  clariClientSecret
);

function getTags(buffer) {
  return app.models.predict(Clarifai.GENERAL_MODEL, {
    base64: buffer.toString('base64')
  }).then(res => res.outputs[0].data.concepts.map(t => t.name))
}

module.exports = {
  getTags
};
