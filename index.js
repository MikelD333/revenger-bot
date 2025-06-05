const { Telegraf } = require('telegraf')
require('dotenv').config()

const TOKEN = process.env.BOT_TOKEN
const WEB_APP_URL = process.env.WEB_APP_URL

if (!TOKEN || !WEB_APP_URL) {
  console.error('❌ Необходимо указать BOT_TOKEN и WEB_APP_URL в .env файле')
  process.exit(1)
}

const bot = new Telegraf(TOKEN)

bot.start((ctx) => {
  const name = ctx.from.first_name || 'друг'
  ctx.reply(`Привет, ${name}! 👋\nНажми кнопку ниже, чтобы открыть приложение:`, {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Открыть Web App',
          web_app: { url: WEB_APP_URL }
        }
      ]]
    }
  })
})

bot.on('message', (ctx) => {
  const msg = ctx.message
  if (msg.web_app_data) {
    try {
      const data = JSON.parse(msg.web_app_data.data)
      console.log('Получены данные из Web App:', data)
      ctx.reply(`Спасибо! Получены данные: ${JSON.stringify(data)}`)
    } catch (e) {
      ctx.reply('⚠️ Не удалось обработать данные из Web App')
    }
  }
})

bot.launch()
  .then(() => console.log('🚀 Бот запущен'))
  .catch(console.error)

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
