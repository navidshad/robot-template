var alertToAmin = function(newMess){
    fn.db.user.find({'isAdmin': true}, 'userId').exec((e, admins) => {
        //user message
        inboxMess = 'پیام از طرف ' + '@' + newMess.username +
        '\n' + 'ــــــــــــــــــــ' + '\n' + newMess.message +
        '\n' + 'ــــــــــــــــــــ' + '\n' + '⚠️ ' + 'برای ارسال پاسخ لطفا به بخش "صندوق پیام" در بخش مدیریت بروید.' +
        '\n \n @' + global.robot.username;

        //send to admins
        admins.forEach(admin => {
            global.robot.bot.sendMessage(admin.userId, inboxMess);
        });
    });
}

module.exports = function(message, speratedSection){
    var last = speratedSection.length-1;
    //ask to send massage to admin
    if (message.text === fn.mstr['inbox'].lable){
        console.log('getting message');
        fn.userOper.setSection(message.from.id, fn.mstr['inbox'].lable, true);        
        global.robot.bot.sendMessage(message.from.id, fn.mstr['inbox'].getmess, fn.generateKeyboard({section:fn.str['backToMenu']}, true));
    }
    else if(speratedSection[last] === fn.mstr['inbox'].lable){
        console.log('send user message to admin');
        var userMessage = 'شما از طرف ' + message.from.username + ' یک پیام دریافت کرده اید.' + '\n' +
        'ــــــــــــــــــــ' + '\n' +  message.text;

        fn.userOper.checkProfile(message.from.id, (user) => {
            //time
            var time = fn.time.gettime();
            
            //save to inbox
            var newInboxMess = new global.fn.db.inbox({
                'readed'      : false,
                'messId'      : message.message_id,
                'date'        : time,
                'userId'      : user.userId,
                'username'    : user.username,
                'message'     : message.text
            });
            newInboxMess.save();
            alertToAmin(newInboxMess);
            fn.commands.backToMainMenu(message, user, fn.str['seccess']);
        });
    }
}