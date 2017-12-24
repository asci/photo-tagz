const sharp = require('sharp');
const { getFilenames } = require('node-all-files');
const config = require('./config');

const exif = require('./api/exif');
const mscv = require('./api/ms');
const geo = require('./api/geo');
const clari = require('./api/clari');

function getImageBuffer(filename) {
  return sharp(filename)
    .resize(1024, 1024)
    .max()
    .toFormat('jpeg', { quality: 90 })
    .toBuffer();
}

function getUniq(arr) {
  return [...new Set(arr
    .map(t => t.toLowerCase())
  )];
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function getGeotags(ep, filename) {
  const meta = await exif.getMetadata(ep, filename);
  const { Country, City, State, GPSLatitude, GPSLongitude} = meta.data[0];
  const baseGeo = [Country, City, State];

  if (GPSLatitude && GPSLongitude) {
    const extendedGeo = await geo.getTags(GPSLatitude, GPSLongitude);
    baseGeo.push(...extendedGeo);
  }

  return baseGeo.filter(Boolean);
}


async function main() {
  try {
    const [{ files }, ep] = await Promise.all([
      getFilenames(config.workDir, /\.jpe?g$/i),
      exif.createClient()
    ]);
    console.log('=========================files==========================');
    console.dir(files);
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const start = Date.now();
      const buffer = await getImageBuffer(filename);

      const [
        claritags,
        // mstags,
        // msdescribe,
        // geotags,
      ] = await Promise.all([
        clari.getTags(buffer),
        // mscv.getTags(buffer),
        // mscv.getDescribe(buffer),
        // getGeotags(ep, filename)
      ]);

      const tags = getUniq([
        ...claritags,
        // ...mstags,
        // ...geotags
      ]);

      const data = {
        tags,
        // caption: msdescribe.caption + (geotags[0] ? ', ' + geotags[0] + ', ' + geotags[1] : '')
      };

      await exif.setTagsAndCaption(ep, filename, data);

      const usedTime = Date.now() - start;
      if (usedTime < config.delay) {
        await delay(config.delay - usedTime);
      }
      console.log('done', (usedTime / 1000) + 's');
      console.dir(data);
    }
    await ep.close();
  } catch (err) {
    console.log('=========================err==========================');
    console.dir(err);
  }
}

main();
