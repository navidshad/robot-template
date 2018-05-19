var name = 'commerce';

var checkRoute = function(option){

    var btnsArr  = [ 
        fn.mstr.commerce['name'],
        fn.mstr.commerce['back']
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
    titles.push(fn.mstr.commerce['settings']);
    titles.push(fn.mstr.commerce.btns['couponGenerators']);

    var factors = await fn.db.factor.find({'ispaid': true})
    .sort('-_id').limit(10).exec().then();

    factors.forEach(function(item) {
        var title = item.number.toString();
        titles.push(title);
    }, this);

    //show list
    var markup = fn.generateKeyboard({custom:true, list:titles, grid:true, back:fn.str.goToAdmin['back']}, false);
    global.robot.bot.sendMessage(userid, fn.mstr[name].name, markup);
    fn.userOper.setSection(userid, fn.mstr[name].name, true);
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
            var fn_answer = fn.mstr.commerce.query['commerce'] + '-' + fn.mstr.commerce.query['answer'] + '-' + item._id;
            var fn_delete = fn.mstr.commerce.query['commerce'] + '-' + fn.mstr.commerce.query['delete'] + '-' + item._id;
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

var routting = function(message, speratedSection, user)
{
    var text = message.text;
    var last = speratedSection.length-1;
    var couponGenerators = fn.mstr.commerce.btns['couponGenerators'];
    
    //show factor list
    if(text === fn.mstr[name].name || text === fn.mstr[name].back)
        show(message.from.id);
    
    //setting
    else if(text === fn.mstr[name].settings || speratedSection[3] === fn.mstr[name].settings) 
        setting.routting(message, speratedSection);

    //generators
    else if(text === couponGenerators || speratedSection[3] === couponGenerators) 
        couponGenerator.routting(message, speratedSection);
}

var setting = require('./settings');
var user    = require('./user');
var query   = require('./query');
var coupon  = require('./admin/coupon');
var couponGenerator = require('./admin/couponGenarator');
var gates = {
    'nextpay': require('./gates/nextpay'),
}

module.exports = { name, checkRoute, routting, query, show, user, gates, 
    coupon, couponGenerator 
}