var name = 'chanelChecker';

var checkRoute = function(option){

    var btnsArr  = [ 
        fn.mstr.chanelChecker['name'],
        fn.mstr.chanelChecker['back']
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

    //checl seperate section
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

var showchanelCheckerSetting = function(userid, detail){
    var activationtext = '',
    moduleOption = fn.getModuleOption(name, {'create': true}).option;
    index = null;

    //defin activation button
    activationtext = (moduleOption.active) ? 'disable' : 'enable';

    var channel = (moduleOption.datas[0]) ? moduleOption.datas[0].name : 'هنوز هیچ کانالی متصل نشده است';
    var mess = fn.mstr.chanelChecker['name'] + '\n' +
    '📣 ' + 'کانال متصل شده: ' + channel;
    
    var list = [
        fn.str.activation[activationtext],
        fn.mstr.chanelChecker['addChannel']
    ],
    back = fn.str.goToAdmin['back'],
    remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);

    global.robot.bot.sendMessage(userid, mess, remarkup);
    fn.userOper.setSection(userid, fn.mstr.chanelChecker['name'], true);    
}

var isActive = function(){
    //console.log('check channelCkeck is active or not');
    var moduleOption = fn.getModuleOption('chanelChecker');
    if (moduleOption) return moduleOption.option.active;
    else return false;
}

var registerChannel = function(chat, messageid){
    var moduleOption = fn.getModuleOption('chanelChecker');
    var detail = [];
    detail.push({'name':chat.username, 'value':chat.id});
    global.robot.confige.moduleOptions[moduleOption.index].datas = detail;
    global.robot.save();
    global.robot.bot.deleteMessage(chat.id, messageid);
}

var getUser = function(userid){
    var moduleOption = fn.getModuleOption('chanelChecker');
    var chatid = 0;

    if(moduleOption.option.datas.length > 0) 
        chatid = moduleOption.option.datas[0].name;

    return new Promise((resolve, reject) => {
        global.robot.bot.getChatMember(chatid, userid, (e, result) => {
            if(result) resolve(result);
            else{
                console.log(e);
                reject(e);
            }
        }); 
    });
}

var InviteUser = function(userid){
    //console.log('Invite user to be a momber of channel');
    var chanel = '-';
    var moduleOption = fn.getModuleOption('chanelChecker').option;
    if(moduleOption.datas.length > 0) 
        chanel = moduleOption.datas[0].name;

    var mess = 'کاربر گرامی شما ابتدا باید در کانال زیر عضو شوید.' + '\n @' + chanel;
    global.robot.bot.sendMessage(userid, mess);
}

var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;
    //show chanelChecker setting
    if (text == fn.mstr.chanelChecker['name'] || text == fn.mstr.chanelChecker['back'])
        showchanelCheckerSetting(message.from.id);

    //active or deactive
    else if(fn.checkValidMessage(text, [fn.str.activation.enable,fn.str.activation.disable])){
        console.log('active deactive chanelChecker');
        var key = (text === fn.str.activation.enable) ? true : false;
        global.robot.confige.moduleOptions.forEach(function(element) {
            if(element.name === 'chanelChecker') 
                element.active = key;
        }, this);

        global.robot.save();
        showchanelCheckerSetting(message.from.id);
        fn.getMainMenuItems();
    }

    //set telegram channel
    else if (text === fn.mstr.chanelChecker['addChannel']){
        console.log('set telegram chenel username');
        var mess = fn.mstr.chanelChecker['addChannelMess'];
        global.robot.bot.sendMessage(message.from.id, mess)
        .then((msg) => {
            global.robot.bot.sendMessage(message.from.id, fn.mstr.chanelChecker['addChannelRegister']);
        });
    }

}

module.exports = { name, checkRoute, routting, registerChannel, getUser, InviteUser, isActive}