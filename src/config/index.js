require('dotenv').config();

module.exports = {
  biotime: {
    url: process.env.BIOTIME_URL,
    username: process.env.BIOTIME_USERNAME,
    password: process.env.BIOTIME_PASSWORD,
  },
  apiKey: process.env.API_KEY,
  port: process.env.PORT || 3000,
};