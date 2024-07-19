
const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
    ctx.reply('Welcome RUSLAN!', Markup.inlineKeyboard([
        Markup.button.url('Open Mini App', 'https://url_to_open.com'),
    ]));
});






bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))