var name = 'settings';

var checkRoute = function(option){

    var btnsArr  = [ 
        fn.mstr.settings['name'],
        fn.mstr.settings['back'],
    ];

    var result = {}
    //check text message
    if(option.text) btnsArr.forEach(btn => { 
        if(option.text === btn) 
        {
            result.status = true; 
            result.button = btn;
            result.routting = routting;
        }
    });

    //check seperate section
    if(option.speratedSection){
        option.speratedSection.forEach(section => {
            btnsArr.forEach(btn => 
            { 
                if(section === btn){
                    result.status = true; 
                    result.button = btn;
                    result.routting = routting;
                }
            });
        });
    }

    //return
    return result;
}

var show = function(userid, injectedtext){
    fn.userOper.setSection(userid, fn.mstr.settings['name'], true);
    var list = fn.convertObjectToArray(fn.mstr.settings['btns'], null);
    var back = fn.str.goToAdmin['back'];
    var mess = (injectedtext) ? injectedtext : fn.mstr.settings['name'];
    var replymarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    global.robot.bot.sendMessage(userid, mess, replymarkup);        
}

var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;
    
    //show root
    if(text === fn.mstr.settings['name'] || text === fn.mstr.settings['back']) show(message.from.id);

    //first message of robot
    else if (text === fn.mstr.settings.btns['firstmess']){
        var mess = fn.mstr.settings.btns['firstmess'];
        var replymarkup = fn.generateKeyboard({'section': fn.mstr.settings['back']}, true);
        global.robot.bot.sendMessage(message.from.id, mess, replymarkup);
        fn.userOper.setSection(message.from.id, mess, true);
    }
    else if (speratedSection[3] === fn.mstr.settings.btns['firstmess']){
        if(text.length < 10) {global.robot.bot.sendMessage(message.from.id, fn.mstr.settings.mess['shorttext']); return;}
        global.robot.confige.firstmessage = text;
        global.robot.save();
        show(message.from.id, fn.str['seccess']);
    }
}

module.exports = { name, checkRoute, routting, show }