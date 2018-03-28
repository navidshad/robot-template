var name = 'bag';

var checkRoute = function(option){

    var btnsArr  = [ 
        fn.mstr.bag['name'],
        fn.mstr.bag['back']
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

var show = async function(userid)
{
    var botusername = global.robot.username;    
    var titles = [];
    titles.push(fn.mstr.bag['settings']);

    var factors = await fn.db.factor.find({'bot':botusername, 'ispied': true})
    .sort('-_id').exec().then();
    
    factors.forEach(function(item) {
        var readedSym = fn.mstr.bag.readSym[0];
        if(item.readed)  readedSym = fn.mstr.bag.readSym[1];
        var title = 'ـ ' + readedSym + ' ' + item.username + ' | ' + item.date;
        titles.push(title);
    }, this);

    //show list
    if(titles.length > 0){
        var markup = fn.generateKeyboard({custom:true, list: titles, back:fn.str.goToAdmin['back']}, false);
        global.robot.bot.sendMessage(userid, fn.mstr['bag'].name, markup);
        fn.userOper.setSection(userid, fn.mstr['bag'].name, true);
    }
    else global.robot.bot.sendMessage(userid, 'هنوز هیچ فاکتوری ثبت نشده است.');
}

var showFactor = function(message){
    var botusername = global.robot.username;
    //get date from message
    seperateText = message.text.split('|');
    date = seperateText[1];
    date = (date) ? date.trim() : '';

    //find message
    fn.db.bag.findOne({'date':date, 'bot':botusername}, function(ee, item){
        if(item){
            var detailArr = [];
            var fn_answer = fn.mstr.bag.query['bag'] + '-' + fn.mstr.bag.query['answer'] + '-' + item._id;
            var fn_delete = fn.mstr.bag.query['bag'] + '-' + fn.mstr.bag.query['delete'] + '-' + item._id;
            detailArr.push([ 
                {'text': 'ارسال پاسخ', 'callback_data': fn_answer},
                {'text': 'حذف', 'callback_data': fn_delete}
            ]);

            bagMess = 'پیام از طرف ' + '@' + item.username +
            '\n' + 'ــــــــــــــــــــ' + '\n' + item.message + '\n \n @' + global.robot.username;
            global.robot.bot.sendMessage(message.from.id, bagMess, {"reply_markup" : {"inline_keyboard" : detailArr}});
        }
        else{
            global.robot.bot.sendMessage(message.from.id, 'این پیام دیگر موجود نیست');
        }
    });
}

var setting = require('./settings');
var user    = require('./user');
var nextpay = ''; //require('./nextpay/nextpay');
var query = require('./query');

var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;

    //show factor list
    if(text === fn.mstr['bag'].name || text === fn.mstr['bag'].back)
        show(message.from.id);
    
    //setting
    else if(text === fn.mstr['bag'].settings || speratedSection[3] === fn.mstr['bag'].settings) 
        setting.routting(message, speratedSection);
}

module.exports = { name, checkRoute, routting, query, show, user, nextpay }