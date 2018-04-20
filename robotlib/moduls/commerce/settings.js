var show = function(userid, newcat){
    var mName = fn.mstr.commerce['modulename'];
    var activationtext = '',
    moduleOption = fn.getModuleOption(mName,  {'create': true});
    
    //defin activation button
    activationtext = (moduleOption.option.active) ? 'disable' : 'enable';
    //defin new category
    if(newcat) {
        moduleOption.option.category = newcat;
        moduleOption.option.buttons = fn.convertObjectToArray(fn.mstr.commerce.btns_user);
        global.robot.config.moduleOptions[moduleOption.index] = moduleOption.option;
        //save configuration
        global.robot.save();
        fn.updateBotContent( () => { show(userid); });
    }

    //get nextpay api key
    var nextpayapikey = fn.getModuleData(mName, 'nextpayapikey');
    nextpayapikey = (nextpayapikey) ? nextpayapikey.value : '...';

    var list = [
        fn.mstr['category'].asoption, 
        fn.str.activation[activationtext],
        fn.str['editOrder'],
        fn.mstr.commerce.btns['nextpay'],
    ],
    back = fn.mstr.commerce['back'],
    remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    
    var detailMess = 'اطلاعات افزونه' + '\n'
    + 'دسته: ' + moduleOption.option.category + '\n'
    + 'نام دکمه در منو: ' + moduleOption.option.buttons + '\n'
    + 'اولویت در منو: ' + moduleOption.option.btn_order + '\n'
    + 'وضعیت: ' + moduleOption.option.active + '\n'
    + 'کلید api نکست پی: ' + nextpayapikey;

    global.robot.bot.sendMessage(userid, detailMess, remarkup);
    fn.userOper.setSection(userid,  fn.mstr.commerce['settings'], true);    
}

var category = function (message, speratedQuery){
    console.log('set categori for bag');
    fn.userOper.setSection(message.from.id,  fn.mstr['category'].asoption, true);
    var back = fn.mstr.commerce['back'];
    var list = [];
    global.robot.category.forEach((element) => {
        list.push(element.parent + ' - ' + element.name);
    });
    global.robot.bot.sendMessage(message.from.id, fn.mstr.post.edit['category'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

var routting = function(message, speratedSection){
    var mName = fn.mstr.commerce['modulename'];
    var text = message.text;
    var last = speratedSection.length-1;

    //show bag setting
    if (text === fn.mstr.commerce['settings'] || text === fn.mstr.commerce['back'])
        show(message.from.id);

    //active or deactive
    else if(fn.checkValidMessage(text, [fn.str.activation.enable,fn.str.activation.disable])){
        console.log('active deactive bag');
        var key = (text === fn.str.activation.enable) ? true : false;
        var moduleOption = fn.getModuleOption(mName);
        global.robot.config.moduleOptions[moduleOption.index].active = key;
        //save configuration
        global.robot.save();
        fn.updateBotContent( () => { show(message.from.id); });
    }

    //set category
    else if(text === fn.mstr['category'].asoption) category(message, speratedSection);
    else if(speratedSection[last] == fn.mstr['category'].asoption){
        console.log('get new category for bag');
        var cat = text.split(' - ')[1];
        if(fn.m.category.checkInValidCat(cat)) show (message.from.id,  cat);
        else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    }

    //change order
    else if (text === fn.str['editOrder']){
        var mess = fn.str['editOrderMess'];
        var remarkup = fn.generateKeyboard({'section': fn.mstr.commerce['backsetting']}, true);
        global.robot.bot.sendMessage(message.from.id, mess, remarkup);
        fn.userOper.setSection(message.from.id,  fn.str['editOrder'], true);
    }
    else if(speratedSection[last] === fn.str['editOrder']){
        var order = parseInt(text);
        if(!typeof order === 'number') global.robot.bot.sendMessage(message.from.id, fn.str['editOrder']);

        var moduleOption = fn.getModuleOption(fn.mstr.commerce['modulename']);
        global.robot.config.moduleOptions[moduleOption.index].btn_order = order;
        //save configuration
        global.robot.save();
        fn.updateBotContent( () => { show(message.from.id) });
    }

    //get nextpy api key
    else if (text === fn.mstr.commerce.btns['nextpay'])
    {
        var mess = fn.mstr.commerce.mess['getnextpayapikey'];
        var markup = fn.generateKeyboard({'section': fn.mstr.commerce['backsetting']}, true);
        global.robot.bot.sendMessage(message.from.id, mess, markup);
        fn.userOper.setSection(message.from.id,  fn.mstr.commerce.btns['nextpay'], true);
    }
    else if(speratedSection[last] === fn.mstr.commerce.btns['nextpay'])
    {
        var nextpayapikey = text;
        var datas = [{'name': 'nextpayapikey', 'value': nextpayapikey}];
        fn.putDatasToModuleOption(mName, datas);
        show(message.from.id);
    }
}

module.exports = { routting }