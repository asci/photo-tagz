import { throws } from "assert";

const config = {
  workDir: process.env.WORK_DIR || 'test-photos',
  delay: 10000,
  msKey: process.env.MS_KEY,
  googleProjectId: process.env.GOOGLE_PROJECT_ID,
  clariClientId: process.env.CLARI_CLIENTID,
  clariClientSecret: process.env.CLARI_CLIENTSECRET,
  geoKey: process.env.GEO_KEY
};

// validate
if (!config.clariClientId || !config.clariClientSecret) {
  throw new Error('Please, specify clarifai credentials via env vars: CLARI_CLIENTID and CLARI_CLIENTSECRET');
}

module.exports = config;