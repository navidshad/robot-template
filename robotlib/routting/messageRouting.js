fn = global.fn;
menu = require('./menuItemsRouting');

var routting = function(message){
    //commands
    if(message.text && message.text === '/start')                   fn.commands.start(message);
    else if (message.text && message.text === '/getsection')        fn.commands.getsection(message);
    else if (message.text && message.text.includes('/register-'))   fn.commands.registerAdmin(message);
    else if (message.text && message.text.includes('/setcollector-')) fn.commands.setcollector(message);
    else if (message.text && message.text.includes('/dropalldb'))   fn.commands.dropdb(message);

    else{
        //validating user
        fn.userOper.checkProfile(message.from.id, (user) => {
            
            if(!user) return;
            
            //sperate section 
            var speratedSection = user.section.split('/');
            
            //go to meain menu
            if(message.text && message.text === fn.str['backToMenu']) fn.commands.backToMainMenu(message, user.isAdmin, user.isCompelet);
            
            //when profile is compelet
            else if(user.isCompelet){
                console.log('user profile is compelet');
                //text message
                if(message.text)
                {
                    var text = message.text;
                    //go to admin
                    if(text === fn.str.goToAdmin['name'] || text === fn.str.goToAdmin['back'] || speratedSection[1] === fn.str.goToAdmin['name'] && user.isAdmin){
                        fn.adminPanel.routting(message, speratedSection, user);}
                    //menu items
                    else if(text === fn.mstr.category['backtoParent'] || fn.checkValidMessage(text, global.robot.menuItems) || fn.checkValidMessage(speratedSection[1], global.robot.menuItems))
                        menu(message, speratedSection, user);
                    //free message
                    else fn.freeStrings.routting(message, speratedSection, user);
                }

                //non text message
                else fn.upload(message, speratedSection, user);
            }
            //user profile is not compelet
            else if (!isCompelet && message.text){
                console.log('user profile is not compelet', 'you should register first');
                var name = 'کاربر گرامی ' + message.from.first_name + ' عزیر،';
                var pm = name + '\n' + 'شما ابتدا باید پروفایل خود را تکمیل کنید تا بتوانید از امکانات ربات استفاده کنید.';
                global.robot.bot.sendMessage(message.from.id, pm, fn.generateKeyboard({section:fn.str['mainMenu'], "isCompelet": isCompelet}, false));
            }
        });
    }
}

module.exports = { routting }