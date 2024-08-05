const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);

const WEB_APP_URL = process.env.WEB_APP_URL;

bot.start((ctx) => {
    ctx.reply('Welcome to the Toshkin Game!', Markup.inlineKeyboard([
        Markup.button.webApp('🚀 Start!', WEB_APP_URL)
    ]));
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;