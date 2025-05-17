const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getAppAccessToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
    method: 'POST'
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token from Twitch');
  }

  return data.access_token;
}

module.exports = { getAppAccessToken };
