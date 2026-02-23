require('dotenv').config();

module.exports = {
  biotime: {
    url: process.env.BIOTIME_URL,
    username: process.env.BIOTIME_USERNAME,
    password: process.env.BIOTIME_PASSWORD,
  },
  external: {
    shiftsEndpoint: process.env.EXTERNAL_SHIFTS_ENDPOINT,
    token: process.env.EXTERNAL_API_TOKEN,
  },
  apiKey: process.env.API_KEY,
  port: process.env.PORT || 3000,
};
