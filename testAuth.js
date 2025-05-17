require('dotenv').config();
const { getAppAccessToken } = require('./utils/twitchAuth');

getAppAccessToken()
  .then(token => console.log("✅ Twitch Access Token:", token))
  .catch(err => console.error("❌ Error:", err));
