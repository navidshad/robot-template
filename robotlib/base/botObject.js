global.messageRouting = require('../routting/messageRouting.js');
global.queryRouting = require('../routting/queryRouting.js');

module.exports = function(detail){
    this.username = detail.username
    this.token = detail.token;
    this.bot = {};
    this.adminWaitingList = [];
    this.confige = detail.confige;
    this.category = [];
    this.menuItems = [];

    this.start = function(){ 
        this.load();
        global.robot = this;
        var bot = new global.fn.telegramBot(this.token, {polling: true});
        global.robot.bot = bot;

        //Message
        global.robot.bot.on('message', (msg) => {
            //console.log(msg.text);
            bot.sendChatAction(msg.chat.id, 'typing');
            global.messageRouting.routting(msg);
        });

        //callback 
        global.robot.bot.on('callback_query', (query) => {
            //console.log(query);
            global.queryRouting.routting(query);
        });

        //channel post 
        global.robot.bot.on('channel_post', (post) => {
            console.log(post);
            if(post.text === fn.mstr.chanelChecker['addChannelRegister'])
                global.fn.m.chanelChecker.registerChannel(post.chat, post.message_id);
            //global.queryRouting.analyze(query);
        });
    }

    this.save = async function(saveCalBack)
    {
        var conf = await global.fn.db.confige.findOne({"username": this.username}).exec().then();
        if(conf)
        {   //update
            conf.username = global.robot.username,
            conf.firstmessage = global.robot.confige.firstmessage,
            conf.modules = global.robot.confige.modules,
            conf.moduleOptions = global.robot.confige.moduleOptions
        }
        else
        {   //create
            var conf = new global.fn.db.confige({
                "username": global.robot.username,
                "firstmessage" : global.robot.confige.firstmessage,
                "modules": global.robot.confige.modules,
                "moduleOptions": global.robot.confige.moduleOptions
            });
        }

        //save
        await conf.save().then();
        if(saveCalBack) saveCalBack();
        //get main menu items
        global.fn.getMainMenuItems();
    }

    this.load = async function(loadCalBack)
    {
        var conf = await global.fn.db.confige.findOne({"username": this.username}).exec().then();
        if(conf){
            global.robot.confige.moduleOptions = conf.moduleOptions;
            global.robot.confige.firstmessage = conf.firstmessage;
            if(loadCalBack) loadCalBack();
        }
        else if(loadCalBack) loadCalBack();
        //get main menu items
        global.fn.updateBotContent();
    }
}