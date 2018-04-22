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
            if(post.text === '/registerbot')
                global.fn.m.chanelChecker.registerChannel(post.chat, post.message_id);
            //global.queryRouting.analyze(query);
        });
    }

    this.save = async function(saveCalBack)
    {
        var updated = false;
        var options = {
            //update
            'username'    : global.robot.username,
            'firstmessage' : global.robot.config.firstmessage,
            'moduleOptions': global.robot.config.moduleOptions
        }

        var conf = await global.fn.db.config.findOne({"username": this.username}).exec()
        .then().catch(e => { console.log(e) });

        if(conf)
        {
            updated = true;
            conf.username = options.username;
            conf.firstmessage = options.firstmessage;
            conf.moduleOptions = options.moduleOptions;
            await conf.save().then();
        }

        if(!updated)
        {
            //create
            await new global.fn.db.config({
                "username": global.robot.username,
                "firstmessage" : global.robot.config.firstmessage,
                "moduleOptions": global.robot.config.moduleOptions
            }).save();
        }

        // if(conf)
        // {   //update
        //     conf.username = global.robot.username,
        //     conf.collectorlink = global.robot.config.collectorlink,
        //     conf.firstmessage = global.robot.config.firstmessage,
        //     conf.modules = global.robot.config.modules,
        //     conf.moduleOptions = global.robot.config.moduleOptions
        // }

        // else
        // {   
        // }

        // //save
        // await conf.save().then()
        // .catch(e => {
        //     console.log(e);
        // });

        // if(saveCalBack) saveCalBack();

        //get main menu items
        global.fn.getMainMenuItems();
    }
 
    this.load = async function(loadCalBack)
    {
        var conf = await global.fn.db.config.findOne({"username": this.username}).exec().then();
        if(conf){
            global.robot.config.moduleOptions  = conf.moduleOptions;
            global.robot.config.firstmessage   = conf.firstmessage;
            global.robot.config.domain         = conf.domain;
            if(loadCalBack) loadCalBack();
        }
        else if(loadCalBack) loadCalBack();
        //get main menu items
        global.fn.updateBotContent();
    }
}