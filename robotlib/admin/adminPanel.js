fn = global.fn;
var show = function(message){
    fn.userOper.setSection(message.from.id, fn.str.goToAdmin['name'], true);
    markup = fn.generateKeyboard({section:fn.str.goToAdmin['name'], 'list':fn.mstr}, false);        
    global.robot.bot.sendMessage(message.from.id, fn.str.goToAdmin['name'], markup);
}

var routting = function(message, speratedSection){
    //go to Admin 
    if(message.text === fn.str.goToAdmin['name'] || message.text === fn.str.goToAdmin['back']){
        console.log('got to admin section');
        show(message);
    }

    //post contents
    else if(message.text === fn.mstr.post['name'] || message.text === fn.mstr.post['back'] || speratedSection[2] === fn.mstr.post['name']){
        console.log('go to static content');
        fn.m.post.routting(message, speratedSection);
    }

    //category
    else if(message.text == fn.mstr.category['name'] || message.text == fn.mstr.category['back'] || speratedSection[2] == fn.mstr.category['name']){
        console.log('go to category');
        fn.m.category.routting(message, speratedSection);
    }

    //go to inbox
    else if(message.text === fn.mstr['inbox'].name || speratedSection[2] === fn.mstr['inbox'].name){
        console.log('got to inbox section');
        fn.m.inbox.routting(message, speratedSection);        
    }
    
    //go to sendbox
    else if(message.text === fn.mstr['sendMessage'].name || speratedSection[2] === fn.mstr['sendMessage'].name){
        console.log('send message to users');
        fn.m.sendbox.analyze(message, speratedSection);
    }

    //go to settings
    else if (message.text === fn.mstr.settings['name'] || message.text === fn.mstr.settings['back'] || speratedSection[2] === fn.mstr.settings['name'])
        fn.m.settings.routting(message, speratedSection);

    //go to search
    else if (message.text === fn.mstr.search['name'] || message.text === fn.mstr.search['back'] || speratedSection[2] === fn.mstr.search['name'])
        fn.m.search.routting(message, speratedSection);
}

module.exports = {routting, show}