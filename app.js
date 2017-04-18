var JKBot = require('./lib/jkbot');

//var settings = {
//    token: 'xoxb-170029841747-SA5OKNvlBmcq0ACTdh37176d',
//    name: 'jkbot',
//    dbPath: ''
//};

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var settings = {
    token: token,
    name: name,
    dbPath: dbPath
};

//Ref:- http://tinyurl.com/kjxdcmp
var bot = new JKBot(settings);
bot.run();