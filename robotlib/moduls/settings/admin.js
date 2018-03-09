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
        fn.userOper.setSection(message.from.id, fn.mstr.settings.btns['firstmess'], true);
        var replymarkup = fn.generateKeyboard({'section': fn.mstr.settings['back']}, true);
        global.robot.bot.sendMessage(message.from.id, fn.mstr.settings.mess['firstmess'], replymarkup);  
    }
    else if (speratedSection[3] === fn.mstr.settings.btns['firstmess']){
        if(text.length < 10) {global.robot.bot.sendMessage(message.from.id, fn.mstr.settings.mess['shorttext']); return;}
        global.robot.confige.firstmessage = text;
        global.robot.save();
        show(message.from.id, fn.str['seccess']);
    }

}
module.exports = {routting, show}