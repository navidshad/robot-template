global.messageRouting = require('../routting/messageRouting.js');
global.queryRouting = require('../routting/queryRouting.js');

module.exports = function(detail){
    this.username = detail.username
    this.token = detail.token;
    this.bot = {};
    this.adminWaitingList = [];
    this.config = detail.config;
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
        var update = {
            //update
            'username'    : global.robot.username,
            'firstmessage' : global.robot.config.firstmessage,
            'moduleOptions': global.robot.config.moduleOptions
        }

        var count = await global.fn.db.config.count({'username': this.username}).exec().then();
        //update
        if(count > 0)
            await global.fn.db.config.update({"username": this.username}, update).exec().then();
        //creat
        else await new global.fn.db.config(update).save();
    }

    this.load = async function(loadCalBack)
    {
        var conf = await global.fn.db.config.findOne({"username": this.username}).exec().then();
        if(!conf) this.save();
        if(conf){
            global.robot.config.moduleOptions = conf.moduleOptions;
            global.robot.config.collectorlink = conf.collectorlink;
            global.robot.config.firstmessage = conf.firstmessage;
            if(loadCalBack) loadCalBack();
        }
        else if(loadCalBack) loadCalBack();
        //get main menu items
        global.fn.updateBotContent();
    }
}