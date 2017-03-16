# shipandco-tasks

Scheduled tasks used to monitor Shipandco application.

Built with https://webtask.io CRON feature.

## Requirements

Install webtask CLI tool globally and login:

```
npm install wt-cli -g
```

## CRON #1: `check-sync`

Task to notify the staff if any shop has not been synchronized over the last 10 minutes.

### Credentials

Set up the 'secrets' variables in the `.env` file, at the root of the project

```
WEBHOOK_URL=https://hooks.slack.com/services/**************
API_HOST=http://***.***.**.***:****
TOKEN=**********
```

### Commands

Deploy the CRON:

```
npm run deploy.cron
```

View the CRON list:

```
wt cron ls
```

Example of response:

```
Name:        check-sync
State:       active
Container:   wt-mikeair-gmail_com-0
Schedule:    1-59/5 * * * *
Next run:    3/16/2017, 9:46:00 AM
```

Check the CRON job history:

```
wt cron history check-sync
```

Example of response:

```
scheduled_at:      2017-03-16T00:46:00.925Z
started_at:        2017-03-16T00:46:20.398Z
completed_at:      2017-03-16T00:46:21.538Z
type:              success
statusCode:        200
body:              {"message":"No sync since 2 minutes for :ebay:, :prestashop15:, :base:, :rakuten: shops!","status":"late","shops":{"ebay":6,"prestashop15":6,"base":6,"amazon":1,"rakuten":6},"slackResult":"ok"}
```

Delete the CRON:

```
wt cron rm check-sync
```

For test purpose, instead of deploying the CRON, it's possible to deploy a 'webtask' (a URL end-point to trigger the same code). It's convenient to check the result of the code running on webtask.io infrastructure, without having to wait for the CRON execution.
