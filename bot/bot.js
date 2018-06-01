var create = async function()
{
    var botObject = require('./base/botObject.js');
    
    //make the bot to be an object
    var newBot = new botObject({
        token: global.config.token,
        username: global.config.botusername,
        config : {'modules':global.config.modules}
    });

    //start bot
    await newBot.start();
    //get category list and main menu item
    global.fn.updateBotContent();
}

var settingUp = function()
{
    return new Promise(async (resolve, reject) => 
    {
        //get approot path
        global.appRoot = __dirname;
        //get config
        global.config = require('../config');
        //setting test run
        if(global.config.testRun)
        {
        global.config.dbpath = global.config.dbpath_test;
        global.config.token = global.config.token_test;
        }
        
        ///must be declear first
        events = require('events');
        global.fn = { eventEmitter: new events.EventEmitter() };
        global.mRoutes = [];
        global.searchRoutes = [];

        await getMstrs().then();
        await getModuls().then();
        await getFunctions().then();
        await getDbModels().then();

        // //function
        global.fn.strArr = global.fn.convertObjectToArray(fn.str, {'nested': true});
        global.fn.mstrArr = global.fn.convertObjectToArray(fn.mstr, {'nested': true});

        //start robot;
        await create();
        resolve();
    });
}

var getMstrs = function()
{
    return new Promise((resolve, reject) => {
        var dir = require('path').join( global.appRoot , 'moduls');
        var option = {'filter':['.js'], 'name':'mstr'};
        global.fn.mstr = {};
        //get Mstr file paths
        filWalker.walk(dir, option, (e, list) => 
        {
            if(e) reject(e);
            else {
                //console.log(list);
                list.forEach(mstr => {
                    global.fn.mstr = extend(global.fn.mstr, require(mstr));
                });
                resolve();
            }
        });

    });
}

var getModuls = function()
{
    return new Promise((resolve, reject) => {
        var dir = require('path').join( global.appRoot , 'moduls');
        var option = {'filter':['.js'], 'name':'admin'};
        global.fn.m = {};
        //get Mstr file paths
        filWalker.walk(dir, option, (e, list) => 
        {
            if(e) reject(e);
            //console.log(list);
            list.forEach(m =>
            {
                var emodule = require(m);
                //console.log(emodule.name)
                global.fn.m[emodule.name] = emodule;
                
                //get module route functions
                var route = {}
                route.name      = emodule.name;
                route.admin     = emodule.checkRoute;

                if(emodule.user){
                    route.user       = emodule.user.checkRoute;
                    route.getButtons = (emodule.user.getButtons) ? emodule.user.getButtons : null;
                    route.searchRoute= (emodule.user.searchRoute) ? emodule.user.searchRoute : null;
                }

                route.upload    = (emodule.upload) ? emodule.upload.checkUpload : null;
                route.query     = (emodule.query) ? emodule.query.checkQuery : null;
                global.mRoutes.push(route);
            });
            resolve();
        });
    });
}

var getFunctions = function()
{
    return new Promise((resolve, reject) => {
        var fn = require('./functions');
        global.fn = extend(global.fn, fn);
        resolve();
    });
}

var getDbModels = function()
{
    return new Promise((resolve, reject) => {
        var dir = require('path').join( global.appRoot , 'moduls');
        var option = {'filter':['.js'], 'name':'db'};
        //get Mstr file paths
        filWalker.walk(dir, option, (e, list) => {
            if(e) reject(e);
            //console.log(list);
            list.forEach(db => {
                //console.log(db)
                var model = require(db);
                global.fn.db = extend(global.fn.db, model);
            });
            resolve();
        });

    });
}

function extend(obj, src) 
{
    for (var key in src) {
        if (src.hasOwnProperty(key)) 
            obj[key] = src[key];
    }
    return obj;
}

var filWalker = require('../lib/filewalker');

module.exports = {
    settingUp,
}