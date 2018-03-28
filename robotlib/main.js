module.exports.create = function(){
    var botObject = require('./base/botObject.js');
    
    //make the bot to be an object
    var newBot = new botObject({
        token: global.config.token,
        username: global.config.botusername,
        config : {'modules':global.config.modules}
    });

    //start bot
    newBot.start();
    //get category list and main menu item
    global.fn.updateBotContent();
}
