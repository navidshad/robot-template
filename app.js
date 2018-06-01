var bot = require('./bot/bot');
var web = require('./express/bin/www');

async function start()
{
    await bot.settingUp().then();
    web.start();
}

start();
