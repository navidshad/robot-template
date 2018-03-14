module.exports.create = function(){
    var botObject = require('./base/botObject.js');
    
    //make the bot to be an object
    var newBot = new botObject({
        token: global.confige.token,
        username: global.confige.botusername,
        confige : {'modules':global.confige.modules}
    });

    //start bot
    newBot.start();
    //get category list and main menu item
    global.fn.updateBotContent();
}
