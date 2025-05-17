
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Needed to get raw body for Twitch signature verification
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Health check
app.get('/', (req, res) => {
  res.send('✨ GlowUp Webhook is live');
});

// Main route for Twitch EventSub
app.post('/twitch/eventsub', (req, res) => {
  const messageType = req.header('Twitch-Eventsub-Message-Type');
  const twitchSignature = req.header('Twitch-Eventsub-Message-Signature');
  const rawBody = req.rawBody;
  const secret = process.env.TWITCH_WEBHOOK_SECRET;

  // Validate Twitch Signature
  const messageId = req.header('Twitch-Eventsub-Message-Id');
  const timestamp = req.header('Twitch-Eventsub-Message-Timestamp');
  const computedHmac = 'sha256=' + crypto.createHmac('sha256', secret)
    .update(messageId + timestamp + rawBody)
    .digest('hex');

  if (twitchSignature !== computedHmac) {
    console.error('❌ Invalid Twitch signature');
    return res.status(403).send('Invalid signature');
  }

  const body = req.body;

  if (messageType === 'webhook_callback_verification') {
    console.log('🔒 Verifying Twitch EventSub webhook...');
    return res.status(200).send(body.challenge);
  }

  if (messageType === 'notification') {
    const event = body.event;
    console.log('📡 Twitch Event Received:', body.subscription.type, event);

    // You'll handle stream.online or stream.offline here
    return res.status(200).end();
  }

  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
});
