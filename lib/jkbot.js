var util = require('util');
var path = require('path');
var fs = require('fs');
var Sqlite3 = require('sqlite3').verbose();
var Bot = require('slackbots');

function JKBot(settings) {
    var self = this;
    self.settings = settings;
    self.settings.name = self.settings.name || 'jkbot';
    self.dbPath = self.settings.dbPath || path.resolve(process.cwd(), 'data', 'norrisbot.db');
    self.user =null;
    self.db = null;
}

util.inherits(JKBot, Bot);

JKBot.prototype.run = function() {
    var self = this;
    JKBot.super_.call(self, self.settings);
    self.on('start', self.onStart);
    self.on('message', self.onMessage);
}

//When connected to the slack server
JKBot.prototype.onStart = function(res) {
    var self = this;
    console.log("Connected to slack server: ", res);
    //Get the information about the bot from slack server
    self.loadBotUser();
    //Connect to sqlite database in this case
    self.connectToDB();
    //Check if bot is runned for the first time or not
    self.firstRunCheck();
    
    //api available for use
    //this.postMessageToChannel('some-channel-name', 'Hello channel!');
    //this.postMessageToUser('some-username', 'hello bro!');
    //this.postMessageToGroup('some-private-group', 'hello group chat!');
    
    //Following varibales contains users and channels
    //this.users
    //this.channels
}

JKBot.prototype.loadBotUser = function() {
    var self = this;
    self.user = self.users.filter(function(user) {
        return user.name === self.name;
    })[0];
    console.log("loadBotUser: user: ", self.user);
}

JKBot.prototype.connectToDB = function() {
    var self = this;
    if(!fs.existsSync(self.dbPath)) {
        console.error("File path " + self.dbPath + " doesnot exist.");
        process.exit(1);
    }
    
    console.log("Connecting to sqlite database: ", self.dbPath);
    self.db = new Sqlite3.Database(self.dbPath);
}

JKBot.prototype.firstRunCheck = function() {
    var self = this;
    self.db.get('select val from info where name="lastrun" limit 1', function(err, data) {
        if(err) {
            console.error('Database error: ', err);
            return false;
        }
        
        //If lastrun does not exists in the info table, than create new one and if it exists than update it.
        console.log('Record from database: ', data);
        if(!data) {
            var currentTime = (new Date()).toJSON();
            //If the bot has run for the first time send welcome message to users
            self.sendWelcomeMessage();
            self.db.run('insert into info(name, val) values("lastrun", ?)', currentTime);
        }else {
            self.db.run('update info set val=? where name="lastrun"', currentTime);
        }
    });
}

JKBot.prototype.sendWelcomeMessage = function() {
    this.postMessageToChannel('introduction', 'Hi!! this is JKBot!! Just ping me for funny jokes!!!');
    console.log("Sent welcome message.");
}

//If message is recieved from the slack server
JKBot.prototype.onMessage = function(msg) {
    var self = this;
   console.log("On message event: ", msg);
    /*
    Our onMessage function will intercept every real time API message that is readable by our bot, literally every chat message in the channels where the bot is installed, but also private messages directed to the bot or other real time notifications as notifications of user typing in a channel, edited or deleted messages, users joining or leaving the channel and so on.*/
    if( self.isChatMessage(msg) &&
        self.isChannelMessage(msg) &&
        self.isJKBotMentionedInMessage(msg) &&
        !self.isJKBotMessage(msg)
      ) {
        console.log("Sending reply to the message...");
        self.replyWithRandomJokes(msg);
    }
    
}

//To check if message received from slack server is chat message
JKBot.prototype.isChatMessage = function(msg) {
  console.log('isChatMessage: ', (msg.type === 'message' && msg.text !== ''));
  return (msg.type === 'message' && msg.text !== '');
}

//To chekc if msg recieved from slack server is channel message
JKBot.prototype.isChannelMessage = function(msg) {
    //console.log('isChannelMessage: ', typeof(msg.channel) === 'string');
    return typeof(msg.channel) === 'string'; 
}

//To check if the actual message sent by user contains text JKBot
JKBot.prototype.isJKBotMentionedInMessage = function(msg) {
    //console.log('isJKBotMentionedInMessage: ', (msg.text && msg.text.toLowerCase().indexOf('jkbot') > -1));
    return (msg.text && msg.text.toLowerCase().indexOf('jkbot') > -1);
}

//To check if the message is sent from the JKBot itself so that we can avoid loop
JKBot.prototype.isJKBotMessage = function(msg) {
    //console.log('isJKBotMessage: ', msg.user === this.user.id);
    return msg.user === this.user.id;
}

JKBot.prototype.replyWithRandomJokes = function(msg) {
    var self = this;
    self.db.get('select id, joke from jokes order by used asc, RANDOM() limit 1', function(err, record) {
        if(err) {
            return console.error("Database error: ", err);
        }
        
        var channel = self.channels.filter(function(ch) {
            return ch.id === msg.channel;
        });
        
        console.log("Sending message to channel: ", channel);
        if(channel.length > 0) {
            
            //Send joke whenever anyone sends message specifying jkbot
            self.postMessageToChannel(channel[0].name, record.joke);
            self.db.run('update jokes set used = used + 1 where id = ?', record.id);
        }else if(msg.type === 'message') {
            console.log("Sending personal message to user: ", msg.user);
            var user = self.users.filter(function(usr) {
                return usr.id === msg.user;
            });
            //console.log('Sending message to user: ', user);
            if(user.length > 0) {
                self.postMessageToUser(user[0].name, record.joke);
            }
          
        }

    });
}

module.exports = JKBot;