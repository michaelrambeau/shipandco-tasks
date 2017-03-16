require('dotenv').load()
const exec = require('child_process').exec

const path = './check-sync/webtask.js'
const CRON_INTERVAL = 10 // trigger the CRON job every N minute

// Function used to deploy either the webtask (API end point) if `web === true` or the CRON
module.exports = function ({ web }) {
  const options = [
    '--name check-sync',
    `--secret api_host=${process.env.API_HOST}`,
    `--secret webhook_url=${process.env.WEBHOOK_URL}`,
    `--secret token=${process.env.TOKEN}`
    // ,'--secret channel=#tests_mike'
  ]

  const cmd = !web ? (
    `wt cron schedule ${options.join(' ')} ${CRON_INTERVAL}m ${path}`
  ) : (
    `wt create ${options.join(' ')} ${path}`
  )
  console.log('Starting the deploy process', cmd)

  exec(cmd, (error, stdout, stderr) => {
    if (stdout) console.log(`Done: ${stdout}`)
    if (stderr) console.log(`stderr: ${stderr}`)
    if (error) console.log(`exec error: ${error}`)
  })
}
