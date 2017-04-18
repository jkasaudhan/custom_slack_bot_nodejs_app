# Custom slack bot build using node js
This slack bot replies with jokes when the text 'jkbot' is mentioned in the message.

# Used modules
- slackbots@0.3.0
- sqlite3
- fs
- util
- path

# How to run?
- Our slack bot requires to communicate with the slack server using Slack Real Time Message Apis.
- First of all create new bot/app on slack using slack services (https://ORGANISATION_NAME.slack.com/apps/new/) and note down  bot name token key.
- Clone this project and navigate cloned inside project folder.
- Open app.js in your favourite editor and replace `token` key and `name` with the token and name of the bot respectively.
- type `npm start` and it should run the nodejs server in you local machine.
- Now go to https://slack.com/ and login to slack using your slack account.
- Create any channel for eg. `introduction` and add your bot to this channel.
- Now you can send any message to this channel including the text 'jkbot' and you can see that the bot replies with some dummy jokes.
- You can send a private message to your custom bot including the `jkbot` in the message and you will receive auto reply from the bot.



#### [Kudos to Luciano Mammino and scotch.io for providing guideline to create this custom bot](https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers) 
