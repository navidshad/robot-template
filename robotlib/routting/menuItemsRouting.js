//additional
var showCategoryDir = function(userid,catname, speratedSection){
    fn.getMenuItems(catname, (items, des, noitem) => {

        //parent
        var parent = speratedSection[speratedSection.length-2];
        var back = (parent === fn.str['mainMenu']) ? fn.str['backToMenu'] : fn.mstr.category['backtoParent'];
        if(!noitem){
            fn.userOper.setSection(userid, catname, true);
            global.robot.bot.sendMessage(userid, des, 
                fn.generateKeyboard({'custom': true, 'grid':true, 'list': items, 'back':back}, false));        
        }else global.robot.bot.sendMessage(userid, 'این بخش هنوز خالی است.');

    });
}


//routting
module.exports = function(message, speratedSection, user){
    var text = message.text;
    var last = speratedSection.length-1;

    //back to uper level
    if(text === fn.mstr.category['backtoParent']){
        console.log(speratedSection);
        var from = speratedSection.length-1
        var catname = speratedSection[speratedSection.length-2];
        speratedSection.splice(from, 1);
        
        if(catname === fn.str['mainMenu']) fn.commands.backToMainMenu(message, user);
        else showCategoryDir(message.from.id, catname, speratedSection);
    }

    //back to a category
    if(text.includes(fn.str['back']) && text.split(' - ')[1]){
        console.log('back to category', text);
        var catname = text.split(' - ')[1];
        speratedSection.splice(last, 1);
        fn.userOper.setSection(message.from.id, catname, true);
        showCategoryDir(message.from.id, catname, speratedSection);
    }

    //go to category
    else if(fn.m.category.checkInValidCat(text)){
        console.log('go to category', text);
        speratedSection.push(text);
        showCategoryDir(message.from.id, text, speratedSection);
    }

    //contct with admin
    else if (text === fn.mstr['inbox'].lable || speratedSection[last] === fn.mstr['inbox'].lable){
        console.log('contact with admin');
        fn.m.inbox.user(message, speratedSection);
    }

    //go to a post  
    else{
        console.log('this is a post');
        fn.m.post.user.show(message, message.text, user, 
            //exit and go to free message if item would no be a post 
            (user) => { fn.freeStrings.routting(message, speratedSection, user); 
        });
    }
}