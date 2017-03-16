const deploy = require('./deploy')

// Script to deploy the webtask
// It will generate an URL `https://wt-mikeair-gmail_com-0.run.webtask.io/check-sync`
deploy({ web: true })
