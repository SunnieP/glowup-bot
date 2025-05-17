const { execute } = require("./ping");

module.exports = {
    name: 'vibecheck',
    description: 'Checks the vibe and returns a random energy reading.',
    execute(message, args) {
        const vibes = [
      "🧘‍♀️ Chill AF. Like... incense burning and 90's R&B vibes chill.",
      "🔥 You’re radiating main character energy today.",
      "🌀 The vibes are chaotic but in a *cute* way.",
      "💤 Vibe check: sleepy but still showing up. We love that.",
      "🌈 Giving cozy streamer with a hint of menace.",
      "💅 Unbothered. Moisturized. In your lane. Thriving.",
      "📉 Vibe is low. Drink water and drop a ‘🧡’ in the chat.",
      "🎤 Someone hand you a mic—because the energy is ICONIC."
        ];

        const vibe = vibes[Math.floor(Math.random() * vibes.length)];
        message.reply(vibe);
    },
};