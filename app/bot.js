const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);

const WEB_APP_URL = "https://toshkin.click";

bot.command("setmenu", ctx =>
    // sets Web App as the menu button for current chat
    ctx.setChatMenuButton({
        text: "Launch",
        type: "web_app",
        web_app: { url: WEB_APP_URL },
    }),
);

bot.start((ctx) => {
    ctx.reply('Welcome RUSLAN!');
});

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;