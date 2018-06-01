var show = function(userid, newcat)
{
    var mName = fn.mstr.pinker['modulename'];
    var activationtext = '',
    moduleOption = fn.getModuleOption(mName);

    if(!moduleOption) {
        activationtext = 'enable';
        var option = {
            'name':mName,
            'active':false, 
            'buttons': fn.convertObjectToArray(fn.mstr.pinker['btn_user'], {}), 
            'data':[]
        };
        global.robot.config.moduleOptions.push(option);
        moduleOption = fn.getModuleOption(mName);
    }
    
    //defin activation button
    activationtext = (moduleOption.option.active) ? 'disable' : 'enable';
    //defin new category
    if(newcat) {
        moduleOption.option.category = newcat;
        moduleOption.option.button = null;
        moduleOption.option.buttons = fn.convertObjectToArray(fn.mstr.pinker['btn_user'], {});
        global.robot.config.moduleOptions[moduleOption.index] = moduleOption.option;
    }

    //save configuration
    global.robot.save(() => {
        fn.updateBotContent();
    });

    var list = [
        fn.mstr['category'].asoption, 
        fn.str.activation[activationtext],
        fn.str['editOrder'],
        fn.mstr.pinker.btn_settings['pinkTemplate'],
        fn.mstr.pinker.btn_settings['connectToPinker'],
    ],
    back = fn.mstr.pinker['back'],
    remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    
    var detailMess = 'اطلاعات افزونه' + '\n'
    + 'دسته: ' + moduleOption.option.category + '\n'
    + 'نام دکمه در منو: ' + moduleOption.option.button + '\n'
    + 'اولویت در منو: ' + moduleOption.option.btn_order + '\n'
    + 'وضعیت: ' + moduleOption.option.active;

    global.robot.bot.sendMessage(userid, detailMess, remarkup);
    fn.userOper.setSection(userid, fn.mstr.pinker['settings'], true);    
}

var category = function (message, speratedQuery){
    console.log('set categori for pinker');
    fn.userOper.setSection(message.from.id, fn.mstr['category'].asoption, true);
    var back = fn.mstr['pinker']['back'];
    var list = [];
    global.robot.category.forEach((element) => {
        list.push(element.parent + ' - ' + element.name);
    });
    global.robot.bot.sendMessage(message.from.id, fn.mstr.post.edit['category'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

var routting = function(message, speratedSection){
    var mName = fn.mstr.pinker['modulename'];
    var text = message.text;
    var last = speratedSection.length-1;
    //show pinker setting
    if (text === fn.mstr.pinker['settings'] || text === fn.mstr.pinker['backsetting'])
        show(message.from.id);

    //active or deactive
    else if(fn.checkValidMessage(text, [fn.str.activation.enable,fn.str.activation.disable])){
        console.log('active deactive pinker');
        var key = (text === fn.str.activation.enable) ? true : false;
        var moduleOption = fn.getModuleOption(mName);
        global.robot.config.moduleOptions[moduleOption.index].active = key;
        //save configuration
        global.robot.save();
        fn.updateBotContent(() => { show(message.from.id); });
    }

    //set category
    else if(text === fn.mstr['category'].asoption) category(message, speratedSection);
    else if(speratedSection[last] == fn.mstr['category'].asoption){
        console.log('get new category for pinker');
        var cat = text.split(' - ')[1];
        if(fn.m.category.checkInValidCat(cat)){
            show (message.from.id, cat);
        }else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    }

    //change order
    else if (text === fn.str['editOrder']){
        var remarkup = fn.generateKeyboard({'section': fn.mstr.pinker['backsetting']}, true);
        global.robot.bot.sendMessage(message.from.id, fn.str['editOrderMess'], remarkup);
        fn.userOper.setSection(message.from.id, fn.str['editOrder'], true);
    }
    else if(speratedSection[last] === fn.str['editOrder']){
        var order = parseInt(text);
        if(!typeof order === 'number') global.robot.bot.sendMessage(message.from.id, fn.str['editOrder']);

        var moduleOption = fn.getModuleOption(fn.mstr.pinker['modulename']);
        global.robot.config.moduleOptions[moduleOption.index].btn_order = order;
        //save configuration
        global.robot.save();
        fn.updateBotContent(() => { show(message.from.id); });
    }

    //change pink template
    else if(text === fn.mstr.pinker.btn_settings['pinkTemplate']){
        var remarkup = fn.generateKeyboard({'section': fn.mstr.pinker['backsetting']}, true);
        global.robot.bot.sendMessage(message.from.id, fn.mstr.pinker.mess['pinkTemplate'], remarkup);
        fn.userOper.setSection(message.from.id, fn.mstr.pinker.btn_settings['pinkTemplate'], true);
    }
    else if (speratedSection[last] === fn.mstr.pinker.btn_settings['pinkTemplate']){
        var data = {'name':fn.mstr.pinker.btn_settings['pinkTemplate'], value:text};
        fn.putDatasToModuleOption(mName, [data]);
        show(message.from.id);
    }

    //change connecto to pinker warning
    else if(text === fn.mstr.pinker.btn_settings['connectToPinker']){
        var remarkup = fn.generateKeyboard({'section': fn.mstr.pinker['backsetting']}, true);
        global.robot.bot.sendMessage(message.from.id, fn.mstr.pinker.mess['connectToPinker'], remarkup);
        fn.userOper.setSection(message.from.id, fn.mstr.pinker.btn_settings['connectToPinker'], true);
    }
    else if (speratedSection[last] === fn.mstr.pinker.btn_settings['connectToPinker']){
        var data = {'name':fn.mstr.pinker.btn_settings['connectToPinker'], value:text}
        fn.putDatasToModuleOption(mName, [data]);
        show(message.from.id);
    }
}

module.exports = {routting}