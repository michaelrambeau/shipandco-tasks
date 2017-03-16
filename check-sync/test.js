require('dotenv').config()
const webtask = require('./webtask')

const ctx = {
  data: {
    api_host: process.env.API_HOST || 'http://localhost:3030',
    webhook_url: process.env.WEBHOOK_URL,
    channel: '#tests_mike',
    token: process.env.TOKEN
  }
}

webtask(ctx, (err, result) => {
  if (err) return console.error('Error!', err.message)
  console.log('OK', result)
})
