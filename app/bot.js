const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);

const WEB_APP_URL = "https://toshkin.click";

bot.start((ctx) => {
    ctx.reply('Welcome!', Markup.inlineKeyboard([
        Markup.button.webApp('Open Web App', WEB_APP_URL)
    ]));
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;