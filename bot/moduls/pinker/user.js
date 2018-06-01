var checkRoute = function(option)
{
    var btnsArr  = fn.convertObjectToArray(fn.mstr.pinker['btn_user'], {});
    btnsArr.push(fn.mstr.pinker.mess['answerTo']);

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

    //check seperate section
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

// var routeChecker = function(request){
//     var btns = fn.convertObjectToArray(fn.mstr.pinker['btn_user'], {});
//     btns.push(fn.mstr.pinker.mess['answerTo']);

//     var isValid = false;
//     btns.forEach(element => {
//         //if text
//         if(element === request.text) isValid = true;
            
//         //if array
//         if(request.sections)
//             request.sections.forEach(section => {
//                 if(section === element) isValid = true;
//             });
//     });
//     return isValid;
// }

var alertToAmin = async function(newPink)
{
    var admins = await  fn.db.user.find({'isAdmin': true}, 'userid').exec().then();
    //send to admins
    admins.forEach(admin => { 
        fn.m.pinker.showPink(admin.userid, newPink); 
    });
}

var createPink = function(message, user){
    console.log('send user pink');
    var userMessage = message.text + '\n \n' + '🎈 پینکر کد: ' + '\n' + message.from.id;
    //time
    var time = fn.time.gettime();
    //save to pinker
    var newpinkerMess = new global.fn.db.pinker({
        'readed'      : false,
        'messId'      : message.message_id,
        'date'        : time,
        'userid'      : message.from.id,
        'username'    : message.from.username,
        'message'     : userMessage
    });
    newpinkerMess.save();
    alertToAmin(newpinkerMess);
    fn.commands.backToMainMenu(message.from.id, user, fn.mstr.pinker.mess['pinkDone']);
}

var createPinkAnswer = function(senderid, reciverid, callback){
    var newAnswer = new fn.db.pinkerAnswer({
        'senderid': senderid,
        'reciverid': reciverid,
        'messages': [],
    }).save((e, answer) => {
        if(e) console.log(e);
        callback(answer);
    });
}

var editPinkAnswer = function(id, detail, callback){
    fn.db.pinkerAnswer.findOne({'_id': id}).exec((e, answer) => {
        if(!answer) return;
        if(detail.text)  answer.messages.push(detail);
        answer.save((e) => {
            if(e) console.log(e);
            callback(answer);
        });
    });
}

var sendAnswer = function(userid, pinkerAnswer, previous, user){
    if(pinkerAnswer.messages.length === 0) return;
    var last = pinkerAnswer.messages.length-1;
    var sendto = null;

    var detailArr = [];
    var fn_answer = fn.mstr.pinker.query['pinker'] + '-' + fn.mstr.pinker.query['user'] + '-' + fn.mstr.pinker.query['answer'] + '-' + pinkerAnswer._id + '-' + last;
    var fn_block  = fn.mstr.pinker.query['pinker'] + '-' + fn.mstr.pinker.query['user'] + '-' + fn.mstr.pinker.query['block'] + '-' + pinkerAnswer._id;
    detailArr.push([ 
        {'text': 'ارسال پاسخ', 'callback_data': fn_answer},
        {'text': 'بلاک کردن', 'callback_data': fn_block}
    ]);

    if(userid === pinkerAnswer.senderid)
        sendto = pinkerAnswer.reciverid;
    else if(userid === pinkerAnswer.reciverid)
        sendto = pinkerAnswer.senderid;

    var mess = '';
    if(previous >= 0) mess += '📤 پیام شما: \n' + pinkerAnswer.messages[previous].text + '\n\n';
    mess += '📤 جواب پیام شما: \n' + pinkerAnswer.messages[last].text + '\n\n' + '🎈 پینکر کد: ' + pinkerAnswer.messages[last].from + '\n \n 👙 @' + global.robot.username;
    global.robot.bot.sendMessage(sendto, mess, {"reply_markup" : {"inline_keyboard" : detailArr}});
    fn.commands.backToMainMenu(user.userid, user, fn.mstr.pinker.mess['answerDone']);
}

var routting = function(message, speratedSection, user, mName){
    var mName = fn.mstr.pinker['modulename'];
    var text = message.text;
    var last = speratedSection.length-1;

    //ask to send a pink
    if (message.text === fn.mstr.pinker.btn_user['sendPink']){
        console.log('getting pink');
        fn.userOper.setSection(message.from.id, fn.mstr.pinker.btn_user['sendPink'], true);

        var markup = fn.generateKeyboard({'section':fn.str['backToMenu']}, true);
        var pinkTemplate = fn.getModuleData(mName, fn.mstr.pinker.btn_settings['pinkTemplate']).value;
        var mess = fn.mstr.pinker.mess['getPink'];

        global.robot.bot.sendMessage(message.from.id, pinkTemplate)
        .then(() => {
            global.robot.bot.sendMessage(message.from.id, mess, markup);
        });
    }
    else if(speratedSection[last] === fn.mstr.pinker.btn_user['sendPink']) createPink(message, user);

    //ask to connect to a pinker
    else if (message.text === fn.mstr.pinker.btn_user['connectToPinker']){
        console.log('getting pink id');
        fn.userOper.setSection(message.from.id, fn.mstr.pinker.btn_user['connectToPinker'], true);

        var markup = fn.generateKeyboard({'section':fn.str['backToMenu']}, true);
        var connectToPinker = fn.getModuleData(mName, fn.mstr.pinker.btn_settings['connectToPinker']).value;
        var mess = fn.mstr.pinker.mess['getPinkerid'];

        global.robot.bot.sendMessage(message.from.id, connectToPinker)
        .then(() => {
            global.robot.bot.sendMessage(message.from.id, mess, markup);
        });
    }
    //ast pinker id
    else if (speratedSection[last] === fn.mstr.pinker.btn_user['connectToPinker']){
        if(parseInt(text) > 0){
            createPinkAnswer(message.from.id, parseInt(text), (newAnswer) => {
                var newSection = fn.mstr.pinker.section['createanswer'] + '/' + newAnswer._id;
                fn.userOper.setSection(message.from.id, newSection, true);
                var mess = fn.mstr.pinker.mess['getPinkerText'];
                global.robot.bot.sendMessage(message.from.id, mess);
            });
        }
        else global.robot.bot.sendMessage(message.from.id, fn.mstr.pinker.mess['getPinkerid']);
    }
    //ask message
    else if(speratedSection[last-1] === fn.mstr.pinker.section['createanswer']){
        var ansMess = {'text': text, 'from': message.from.id};
        editPinkAnswer(speratedSection[last], ansMess, (answer) => {
            sendAnswer(message.from.id, answer, -1, user);
        });
    }

    //answer to a pink
    else if (speratedSection[last-2] === fn.mstr.pinker.mess['answerTo']){
        var ansMess = {'text': text, 'from': message.from.id};
        editPinkAnswer(speratedSection[last-1], ansMess, (answer) => {
            sendAnswer(message.from.id, answer, parseInt(speratedSection[last]), user);
        });
    }
}

var query = function(query, speratedQuery)
{
    var last = speratedQuery.length-1;

    if(speratedQuery[2] === fn.mstr.pinker.query['answer']){
        var newSection = fn.str['mainMenu'] + '/' + '/' + fn.mstr['pinker'].name + '/' + fn.mstr.pinker.mess['answerTo'] + '/' + speratedQuery[speratedQuery.length-2] + '/' + speratedQuery[speratedQuery.length-1];
        fn.userOper.setSection(query.from.id, newSection, false);
        var markup = fn.generateKeyboard({'section':fn.str['backToMenu']}, true);
        global.robot.bot.sendMessage(query.from.id, fn.mstr.pinker.mess['answerTo'], markup);
    }
}

module.exports = { routting, checkRoute, query }