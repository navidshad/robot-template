var sendmessage = function(userid, sendboxid){

    global.fn.db.sendbox.findOne({'_id': sendboxid}, function(er, item){

        if(item.text){
            var link = '@' + robot.username;
            var messateText = item.text + '\n' + '\n' + link;

            //find users
            global.fn.db.user.find({}).exec((er, users) => {
                if(users){
                    console.log('send mesage to found userd:', users.length);
                    users.forEach(function(user) {
                        global.robot.bot.sendMessage(user.userId, messateText);
                    }, this);

                    var report = 'پیام ' + item.title + ' به ' + users.length + ' ارسال شد.';
                    global.robot.bot.sendMessage(userid, report);
                }
                else{
                    global.robot.bot.sendMessage(userid, 'هیچ کاربری برای ارسال پیام پیدا نشد');
                    //global.fn.sendbox.editMessage(sendboxid, {}, userid);
                }
            });
        }
        else global.robot.bot.sendMessage(userid, 'شما هنوز متن پیام را ارسال نکرده اید.');
    });
}

module.exports = function(query, speratedQuery){

    //remove query message
    global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);

    //edit message
    if(speratedQuery[1] === global.fn.mstr.sendMessage['queryAdminSndMessEditMessage']){
        console.log('get message text');
        fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr['sendMessage'].name + '/' + fn.mstr.sendMessage['sendMessToUsersEditMess'] + '/' + speratedQuery[speratedQuery.length-1], false);
        global.robot.bot.sendMessage(query.from.id, fn.mstr.sendMessage['sendMessToUsersEditMess'], fn.generateKeyboard({section:fn.mstr['sendMessage'].back}, true));
    }

    //delete message
    else if(speratedQuery[1] === global.fn.mstr.sendMessage['queryAdminSndMessDel']){
        fn.db.sendbox.remove({'_id': speratedQuery[speratedQuery.length-1]}, function(err){
            fn.m.sendbox.showSendBoxsection(query.from.id, fn.str['seccess']);
        });
    }

    //send message
    else if(speratedQuery[1] === global.fn.mstr.sendMessage['queryAdminSndMessSend']){
        sendmessage(query.from.id, speratedQuery[speratedQuery.length-1]);
    }
}