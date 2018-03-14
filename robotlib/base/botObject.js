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
        global.robot.bot = new global.fn.telegramBot(this.token, {polling: true});

        //Message
        global.robot.bot.on('message', (msg) => {
            //console.log(msg.text);
            console.log(msg.photo);
            global.messageRouting.routting(msg);
        });

        //callback 
        global.robot.bot.on('callback_query', (query) => {
            //console.log(query);
            global.queryRouting.routting(query);
        });

        //error
        global.robot.bot.on('error', (error) => {
            console.log(error);
        });
    }

    this.save = function(saveCalBack){
        global.fn.db.confige.findOne({"username": this.username}, function(err, conf){
            if(conf){
                conf.username = global.robot.username,
                conf.collectorlink = global.robot.confige.collectorlink,
                conf.firstmessage = global.robot.confige.firstmessage,
                conf.modules = global.robot.confige.modules,
                conf.moduleOptions = global.robot.confige.moduleOptions
                conf.save(() => {
                    if(saveCalBack) saveCalBack();
                });
            }
            else{
                var conf = new global.fn.db.confige({
                    "username": global.robot.username,
                    "collectorlink": global.robot.confige.collectorlink,
                    "firstmessage" : global.robot.confige.firstmessage,
                    "modules": global.robot.confige.modules,
                    "moduleOptions": global.robot.confige.moduleOptions
                });
                conf.save(() => {
                    if(saveCalBack) saveCalBack();
                });
            }
            //get main menu items
            global.fn.getMainMenuItems();
        });
    }

    this.load = function(loadCalBack){
        global.fn.db.confige.findOne({"username": this.username}, function(err, conf){
            if(conf){
                global.robot.confige.moduleOptions = conf.moduleOptions;
                global.robot.confige.collectorlink = conf.collectorlink;
                global.robot.confige.firstmessage = conf.firstmessage;
                if(loadCalBack) loadCalBack();
            }
            else if(loadCalBack) loadCalBack();
            //get main menu items
            global.fn.updateBotContent();
        });
    }
}