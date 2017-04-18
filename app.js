var JKBot = require('./lib/jkbot');

var token = process.env.BOT_API_KEY;
var dbPath = '';
var name = process.env.BOT_NAME;

var settings = {
    token: token,
    name: name,
    dbPath: dbPath
};

//Ref:- http://tinyurl.com/kjxdcmp
var bot = new JKBot(settings);
bot.run();