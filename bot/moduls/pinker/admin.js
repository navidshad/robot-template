var name = 'pinker';

var checkRoute = function(option){

    var btnsArr  = [ 
        fn.mstr.pinker['name']
    ];

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

var show = function(userid){
    console.log('got to pinker section');
    var titles = [[
        fn.mstr.pinker['pinkerDeleteAll'],
        fn.mstr.pinker['settings']
    ]];

    //get message list
    fn.db.pinker.find({}).sort('-_id').exec(function(err, items){       
        if(items.length > 0){
            items.forEach(function(item) {
                var readedSym = fn.mstr.pinker.readSym[0];
                if(item.readed)  readedSym = fn.mstr.pinker.readSym[1];
                var title = 'ـ ' + readedSym + ' ' + item.username + ' | ' + item.date;
                titles.push(title);
            }, this);
        }
        //show list
        var markup = fn.generateKeyboard({custom:true, list: titles, back:fn.str.goToAdmin['back']}, false);
        global.robot.bot.sendMessage(userid, fn.mstr['pinker'].name, markup);
        fn.userOper.setSection(userid, fn.mstr['pinker'].name, true);
    });
}

var showPink = function(userid, item){
    var detailArr = [];
    var fn_answer = fn.mstr.pinker.query['pinker'] + '-' + fn.mstr.pinker.query['answer'] + '-' + item._id;
    var fn_delete = fn.mstr.pinker.query['pinker'] + '-' + fn.mstr.pinker.query['delete'] + '-' + item._id;
    detailArr.push([ 
        {'text': 'ارسال پاسخ', 'callback_data': fn_answer},
        {'text': 'حذف', 'callback_data': fn_delete}
    ]);

    var pinkerMess = item.message + '\n \n 👙 @' + global.robot.username;
    global.robot.bot.sendMessage(userid, pinkerMess, {"reply_markup" : {"inline_keyboard" : detailArr}});
}

var answerToPink = function(message, messid){
    fn.db.pinker.findOne({'_id':messid}, function(ee, item){
        if(item){
            answer = 'پیام شما:' + '\n';
            answer += item.message + '\n \n';
            answer += 'جواب پیام شما:' + '\n';
            answer += message.text + '\n';
            answer += '\n @' + global.robot.username;
            global.robot.bot.sendMessage(message.from.id, answer);
            global.robot.bot.sendMessage(item.userid, answer).catch((error) => {
                console.log(error.code);  // => 'ETELEGRAM'
                console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
                if(error.response.statusCode === 403) global.robot.bot.sendMessage(message.from.id, 'این کاربر ربات را block کرده است.'); 
            });
            show(message.from.id);
        }
        else{
            global.robot.bot.sendMessage(message.from.id, 'این پیام دیگر موجود نیست');
        }
    });
}

var deleteMessage = function(userid, option){
    var query = {};
    var newSection = fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'];
    if(option.id) query = {'_id':option.id};
    fn.db.pinker.remove(query, function(er){ 
        fn.userOper.setSection(newSection, false);
        show(userid);
    });
}

var routting = function(message, speratedSection){
    //go to pinker
    if(message.text === fn.mstr['pinker'].name || message.text === fn.mstr['pinker'].back)
        show(message.from.id);
    
    //delet all message
    else if(message.text === fn.mstr.pinker['pinkerDeleteAll']) deleteMessage(message.from.id, {'all': true});
    
    //setting
    else if(message.text === fn.mstr['pinker'].settings || speratedSection[3] === fn.mstr['pinker'].settings) 
        setting.routting(message, speratedSection);

    //choose a message
    else if(speratedSection[speratedSection.length-1] === fn.mstr['pinker'].name) {
        //get date from message
        seperateText = message.text.split('|');
        date = seperateText[1];
        date = (date) ? date.trim() : '';

        //find message
        fn.db.pinker.findOne({'date':date}, function(ee, item){
            if(item) showPink(message.from.id, item);
            else global.robot.bot.sendMessage(message.from.id, 'این پیام دیگر موجود نیست');
        });
    }

    //get answer
    else if(speratedSection[speratedSection.length-2] === fn.mstr['pinker'].mess['answer']) answerToPink(message, speratedSection[speratedSection.length-1]);
}

var setting = require('./setting');
var user = require('./user');
var query = require('./query');

module.exports = {name, checkRoute, routting, query, show, showPink, user}