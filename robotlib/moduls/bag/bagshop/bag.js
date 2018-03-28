var createBag = function(userid)
{
    var newBag = new fn.db.bag({
        'userid'        : userid,
        'items'         : [],
        'boughtItems'   : [],
    });
    return newBag.save().then();
}

var get = async function(userid)
{
    var bag = null;
    bag = await fn.db.bag.findOne({'userid': userid}).exec().then();
    if(!bag) bag = await createBag(userid);
    return bag;
}

var additem = async function(userid,  item, option, callback)
{
    var bag = await get(userid);

    //find bot
    var notAdded = true;
    bag.items.forEach(element => {
        if(element.name === item.name) notAdded = false;
    });

    //add item
    if(notAdded) bag.items.push(item);

    //save
    return new Promise((resolve, reject) => {
        bag.save((e) => {
            if(e) {
                console.log(e);
                reject(e);
            }

            var result = {
                'status':notAdded
            }

            resolve(result);
            if(callback) callback(result);
            if(option.showbag === true) show(userid, bag);
        });
    });
}

var addToBag = async function(userid, type, productid){
    var bag = await get(userid);
    var product = null
    var item = {};

    if(type === 'post') {
        product = await fn.db.post.findOne({'_id':productid}).exec().then();
        item = {
            'name'  :product.name, 
            'id'    :productid, 
            'price' :product.price, 
            'type'  :'post'
        };
    }

    var result = await additem(userid, item, {'showbag':true}).then();
    if(!result.status) global.robot.bot.sendMessage(userid, fn.mstr.bag.mess['alreadyAdded']);
}

var show = function(userid, bag,  option)
{
    var detailArr = [];
    var query = fn.mstr.bag.query;
    var fn_submit   = query['bag'] + '-' + query['user'] + '-' + query['submitbag'];
    var fn_clear    = query['bag'] + '-' + query['user'] + '-' + query['clearbag'];
    var fn_close    = query['bag'] + '-' + query['close'];

    //controller btns
    detailArr.push([ 
        {'text': '✅ ' + 'ثبت و پرداخت', 'callback_data': fn_submit},
        {'text': '❌ ' + 'تخلیه سبد', 'callback_data': fn_clear}
    ].reverse());

    //personal info 
    var fn_address = query['bag'] + '-' + query['user'] + '-' + query['address'];
    var fn_phone = query['bag'] + '-' + query['user'] + '-' + query['phone'];
    var fn_showPostalInfo = query['bag'] + '-' + query['user'] + '-' + query['postalInfo'];

    detailArr.push([ 
        {'text': '🏠' + 'آدرس', 'callback_data': fn_address},
        {'text': '📱' + 'موبایل', 'callback_data': fn_phone},
        {'text': '📱🏠' + 'نمایش', 'callback_data': fn_showPostalInfo},
    ].reverse());

    //close
    detailArr.push([{'text': 'بستن سبد', 'callback_data': fn_close}]);

    //products
    var total = 0;
    var titles = '';
    bag.items.forEach((item, i) => {
        titles += '\n' + item.name + ' ' + item.price + ' تومان';
        total += item.price;
    });

    //message
    var mess = '🛍 ' + 'سبد خرید شما' + '\n' +
    '<code>ـــــــــــــــــ' +
    titles + '\n' +
    'ـــــــــــــــــ' + '\n' +
    'جمع قیمت: ' + total + ' تومان' + '\n' +
    'ـــــــــــــــــ</code>' + '\n' +
    fn.mstr.bag.mess['editbag'];

    var showBag = true;
    if(option && option.show != null) showBag = option.show;

    //send
    if(showBag) {
        global.robot.bot.sendMessage(userid, mess, {'parse_mode':'HTML', "reply_markup" : {"inline_keyboard" : detailArr}})
        .then((msg) => {

        });
    }
}

var clear = async function(userid, botindex)
{
    var bag = await fn.db.bag.findOne({'userid':userid}).exec().then();
    if(!bag) return;

    //clear
    bag.items = [];
    //save
    bag.save((e) => {
        if(e) console.log(e);
        show(userid, bag,  {'show':false});
    });
}

var checkBoughtItem = async function(userid, productid)
{   
    var bag = await get(userid);
    var isbought = false;
    bag.boughtItems.forEach(item => {
        if(item.id === productid) isbought = true;
    });

    return isbought;
}
module.exports = { show, additem, clear, get, addToBag, checkBoughtItem }