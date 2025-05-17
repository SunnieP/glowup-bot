require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { getAppAccessToken } = require('../utils/twitchAuth');

const CALLBACK_URL = 'https://7051-2600-8800-320a-9600-588-a948-f8fa-90d7.ngrok-free.app/twitch/eventsub';
const TWITCH_USER_LOGIN = 'SunnieP'; // change this to your Twitch username

async function getUserId(username, token) {
  const res = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.data[0]?.id;
}

async function subscribeToStreamEvents() {
  const token = await getAppAccessToken();
  const userId = await getUserId(TWITCH_USER_LOGIN, token);

  if (!userId) {
    console.error('❌ Could not fetch Twitch user ID');
    return;
  }

  const subscriptionTypes = ['stream.online', 'stream.offline'];

  for (const type of subscriptionTypes) {
    const body = {
      type,
      version: '1',
      condition: {
        broadcaster_user_id: userId
      },
      transport: {
        method: 'webhook',
        callback: CALLBACK_URL,
        secret: process.env.TWITCH_WEBHOOK_SECRET
      }
    };

    const res = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      console.log(`✅ Subscribed to ${type} for ${TWITCH_USER_LOGIN}`);
    } else {
      console.error(`❌ Failed to subscribe to ${type}`, data);
    }
  }
}

subscribeToStreamEvents();
