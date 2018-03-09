var show = function(userid){
    var remarkup = fn.generateKeyboard({'section': fn.mstr.category['backtoParent']}, true);
    var detailMess = fn.mstr.search['getmess'];
    global.robot.bot.sendMessage(userid, detailMess, remarkup);
    fn.userOper.setSection(userid, fn.mstr.search['name'], true);
}

var search = async function(userid, text){
    var list = [];
    var back = fn.mstr.search['back'];
    var mess = 'نتیجه جستجو برای ' + text;

    var posts = await fn.db.post.find({ $text: {$search: text}}).limit(30).exec().then()
    .catch((e) => { 
        console.log(e);
        global.robot.bot.sendMessage(userid, 'دیتابیس باید برای عملیات جستجو تنظیم شود، لطفا به مسئول فنی اطلاع دهید.');
    });

    if(posts.length === 0) {global.robot.bot.sendMessage(userid, fn.mstr.search['notfound']); return;}

    posts.forEach((element) => { list.push(element.name); }, this);
    fn.userOper.setSection(userid, fn.mstr.search['result'], true);
    global.robot.bot.sendMessage(userid, mess, fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false));
}

var showItem = function(message, name){
    fn.m.post.user.show(message, name, () => {
        //item does not existed
        global.robot.bot.sendMessage(message.user.id, fn.str['choosethisItems']);
    });
}

var routting = function(message, speratedSection){
    var mName = fn.mstr.search['modulename'];
    var text = message.text;
    var last = speratedSection.length-1;

    //show search setting
    if (text === fn.mstr.search['lable'] || text === fn.mstr.search['back'])
        show(message.from.id);

    //search
    else if (speratedSection[last] === fn.mstr.search['name'])
        search(message.from.id, text);
    
    //choose item
    else if (speratedSection[last] === fn.mstr.search['result'])
        showItem(message, text);
}

module.exports = { routting }