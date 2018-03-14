var settingUp = async function()
{
    //get approot path
    global.appRoot = __dirname;

    global.confige = require('./config');
    //setting test run
    if(global.confige.testRun){
      global.confige.dbpath = global.confige.dbpath_test;
      global.confige.token = global.confige.token_test;
    }
    
    ///must be declear first
    global.fn = {};
    global.mRoutes = [];
    await getMstrs().then();
    await getModuls().then();
    await getFunctions().then();

    // //function
    global.fn.strArr = global.fn.convertObjectToArray(fn.str, {'nested': true});
    global.fn.mstrArr = global.fn.convertObjectToArray(fn.mstr, {'nested': true});

    //robot
    var botApplication = require('./robotlib/main');
    botApplication.create();
}

var getMstrs = function(){
    return new Promise((resolve, reject) => {
        var dir = require('path').join( global.appRoot , 'robotlib', 'moduls');
        var option = {'filter':['.js'], 'name':'mstr'};
        global.fn.mstr = {};
        //get Mstr file paths
        filWalker.walk(dir, option, (e, list) => {
            if(e) reject(e);
            //console.log(list);
            list.forEach(mstr => {
                global.fn.mstr = extend(global.fn.mstr, require(mstr));
            });
            resolve();
        });

    });
}

var getModuls = function(){
    return new Promise((resolve, reject) => {
        var dir = require('path').join( global.appRoot , 'robotlib', 'moduls');
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
                global.fn.m[emodule.name] = emodule;
                
                //get module route functions
                var route = {}
                route.admin = emodule.checkRoute;
                route.user = (emodule.user) ? emodule.user.checkRoute : null;
                route.upload = (emodule.upload) ? emodule.upload.checkUpload : null;
                route.query = (emodule.query) ? emodule.query.checkQuery : null;
                global.mRoutes.push(route);
            });
            resolve();
        });
    });
}

var getFunctions = function(){
    return new Promise((resolve, reject) => {
        global.fn = extend(global.fn, require('./robotlib/functions'));
        resolve();
    });
}

function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

var filWalker = require('./moduls/filewalker');

module.exports = {
    settingUp,
}