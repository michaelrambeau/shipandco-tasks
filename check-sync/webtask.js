'use latest'

const fetch = require('isomorphic-fetch')

const delay = 10 // Number of minutes. If the last sync is older, we send a message

module.exports = function (ctx, cb) {
  const { webhook_url, api_host, channel, token } = ctx.data
  if (!api_host) return cb(new Error('No API host specified!'))
  if (!webhook_url) return cb(new Error('No webhook url specified'))
  if (!token) return cb(new Error('No token specified'))
  const url = `${api_host}/check-sync`
  const headers = { authorization: token }
  return fetch(url, { headers })
    .then(res => checkStatus(res))
    .then(res => res.json())
    .then(json => parse(json))
    .then(result => {
      if (result.status === 'normal') return result
      const options = {
        webhook_url
      }
      if (channel) options.channel = channel // override the default channel associated with the hook
      return sendSlackMessage(result.message, options)
        .then(slackResult => Object.assign({}, result, {
          slackResult
        }))
    })
    .then(result => cb(null, result))
    .catch(e => cb(e))
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parse (shops) {
  const lateShops = Object.keys(shops)
    .map(shopType => ({
      shopType,
      lastSync: shops[shopType]
    }))
    .filter(shop => shop.lastSync > delay)
  const count = lateShops.length
  const message = count ? (
    `No sync since ${delay} minutes for ${lateShops.map(shop => `:${shop.shopType}:`).join(', ')} shops!`
  ) : (
    `All shops synchronized over the last ${delay} minutes.`
  )
  const status = count ? 'late' : 'normal'
  return {
    message,
    status,
    shops
  }
}

function sendSlackMessage (text, { webhook_url, channel }) {
  const payload = {
    text,
    mrkdwn: true
  }
  if (channel) {
    payload.channel = channel
  }
  console.log('Sending text', JSON.stringify(payload))
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(payload)
  }
  return fetch(webhook_url, requestOptions)
    .then(r => r.text())
}
