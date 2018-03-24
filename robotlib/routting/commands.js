//start bot
var start = function(message){
    //collect 
    var form = Object(message.from);
    form.bot = global.robot.username;

    var id=message.from.id,
    username = message.from.username, fullname= message.from.first_name + ' ' + message.from.last_name;
    fn.userOper.registerId(id, {'username':username, 'fullname':fullname}, (user) => {
        backToMainMenu(message, user);
        if(isAdmin) global.robot.bot.sendMessage(message.from.id, fn.str['youareadmin']);
    });
}

//get user's section
var getsection = function(message){
    fn.userOper.checkProfile(message.from.id, (user) => {
        global.robot.bot.sendMessage(message.from.id, user.section);
    });
}

//register admin
var registerAdmin = function(message){
    //console.log('register someone');
    var sperate = message.text.split('-');
    fn.userOper.addAdminToWaintingList(sperate[1]);
    global.robot.bot.sendMessage(message.from.id, fn.str['registeradmin']);
}

//back to mainMenu
var backToMainMenu = async function(message, user, mess){
    //console.log('go to main menu');
    await fn.getMainMenuItems().then();
    var items = global.robot.menuItems;
    fn.userOper.setSection(message.from.id, fn.str['mainMenu'], false);
    remarkup = fn.generateKeyboard({'section':fn.str['mainMenu'], 'list':items, "isCompelet": user.isCompelet, "isAdmin": user.isAdmin}, false);
    var texttosend = (mess) ? mess : global.robot.confige.firstmessage;
    if(texttosend == null) texttosend = global.fn.str['mainMenuMess'];
    global.robot.bot.sendMessage(message.from.id, texttosend, remarkup);
}

//get word counr
var getWordCount = async function(userid){ 
    var count = await fn.db.word.count({}).exec().then();
    var mess = 'تعداد واژه های جستجو شده توسط کاربران: ' + count;
    global.robot.bot.sendMessage(userid, mess);
}

module.exports = {
    start, getsection, registerAdmin, backToMainMenu, getWordCount,
}