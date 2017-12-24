const Vision = require('@google-cloud/vision');
const { googleProjectId } = require('../config');

const visionClient = Vision({
  projectId: googleProjectId
});

var opts = {
  verbose: true
};

// The name of the image file to annotate
const fileName = './photos/__2016-12-08 14-56-29.jpg';
//
// // Performs label detection on the image file
// visionClient.detectLabels(fileName)
// .then((results) => {
//   return results[0];
// });

visionClient.detectLandmarks(fileName)
  .then((results) => {
  console.log('=========================results==========================');
  console.log(JSON.stringify(results, null, 4));
  const labels = results[0];

  console.log('Landmarks:');
  labels.forEach((label) => console.log(label));
});

//
// visionClient.detectSimilar(fileName, opts)
// .then(results => {
//   return results[0].entities
// })
