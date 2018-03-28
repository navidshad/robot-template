//factor list
var show = async function(userid, injectedText)
{
    var titles = [];
    var factors = await fn.db.factor.find({'userid':userid}).sort('-_id').limit(10).exec().then();
    
    //nothing
    if(factors.length == 0) {
        global.robot.bot.sendMessage(userid, 'اکنون هیچ فاکتوری برای شما ثبت نشده است.');
         return;
    }

    factors.forEach(element => {
        var sym = (element.ispaid) ? fn.mstr.bag['f_peied'] : fn.mstr.bag['f_notpaid'];
        titles.push(sym + ' - ' + element.number);
    });
    
    fn.userOper.setSection(userid,  fn.mstr.bag.btns_user['factor'], true);  
    var mess = (injectedText) ? injectedText : fn.mstr.bag.btns_user['factor'];
    var back = fn.mstr.category['backtoParent'];
    var remarkup = global.fn.generateKeyboard({'custom': true, 'grid':false, 'list': titles, 'back':back}, false);
    global.robot.bot.sendMessage(userid, mess, remarkup);
}

var getNextNumber = async function()
{
    var counter = await fn.db.fnumber.findOne({}).exec().then();
    if(!counter) counter = new fn.db.fnumber({'last': 99});
    
    counter.last++;
    var last = counter.last;
    await counter.save().then();

    return last;
}

var updateItems = async function(items) 
{

    // items.forEach(async item => 
    // {
    //     // item.update = function()
    //     // {
    //         var existItem = null
    //         if(item.type === 'post') 
    //             existItem = await fn.db.post.findOne({'_id': item.id}).exec().then();
            
    //         if(!existItem) {
    //             item.updated = false;
    //             return;
    //         }
    
    //         item.name = existItem.name;
    //         item.price = existItem.price;
    //         item.updated = true;
    //     //}
    // });

    // // return Promise.each(items, (item) => {
        
    // // });
    return items;
}

var create = async function(userid,  items, optionPram)
{
    var option = (optionPram) ? optionPram : {};

    //generate factor Number
    var newNumber = await getNextNumber();

    //update items
    var updatedBagitems = [];
    if(option.noupdate) updatedBagitems = items;
    else updatedBagitems = await updateItems(items);

    //get total amount and titles
    var totalAmount = 0;
    var titles = '';
    updatedBagitems.forEach(item => { 
        totalAmount += item.price;
        titles += '\n' + item.name;
    });
    
    //prepare messag
    var mess = '🛍 ' + 'فاکتور شماره ' + newNumber + '\n' +
    '<code>ـــــــــــــــــ' +
    titles + '\n' +
    'ـــــــــــــــــ' + '\n' +
    'جمع قیمت: ' + totalAmount + ' تومان' + '</code>';

    //create
    var newFactor = new fn.db.factor({
        'number'    : newNumber,
        'userid'    : userid,
        'date'      : fn.time.gettime(),
        'desc'      : mess,
        'products'  : updatedBagitems,
        'amount'    : totalAmount,
    }).save((e, factor) => {
        if(e) console.log(e);
        fn.m.bag.user.bag.clear(userid);
        showFactor(userid,  {'factor': factor});
    });
}

var getPaied = async function(userid,  fid)
{
    var factor = await fn.db.factor.findOne({'_id': fid}).exec().then();
    if(!factor) return;
    factor.ispaid = true;
    await factor.save().then();

    //add product to myProduct array
    var bag = await fn.m.bag.user.bag.get(userid);
    factor.products.forEach(product => { bag.boughtItems.push(product) });
    await bag.save().then();

    //show factor
    showFactor(userid,  {'factor': factor});

    // //send payment messages
    // factor.products.forEach(element => {
    //     //peform specyfic action after peyment according to product type
    //     var types = fn.mstr.bag.factorTypes;
    //     //bot subscription
    //     if(element.type === types['post']){

    //     }
    // });
}

var sendPaymentMessage = async function(userid,  productid)
{
    // var user = await fn.userOper.checkProfile(userid);
    // var product = await fn.db.product.findOne({'_id': productid}).exec().then();
    // fn.m.dynamicProduct.user.showProduct(userid, product, user, {'paidMessageTrigger': true});
}

var showfactorItems = async function(userid,  id)
{
    // var factor = await fn.db.factor.findOne({'_id':id}).exec().then();
    // if(!factor) return;

    // //
    // factor.products.forEach(item => { 
    //     recognizeItemAndShow(userid, item.type, item.id); 
    // });
};

var recognizeItemAndShow = async function(userid, type, productid)
{
        // var type_product = fn.mstr.dynamicProduct['modulename'];
        // var type_advice = fn.mstr.advice['modulename'];

        // //product
        // if(type = type_product) {
        //     var product = await fn.db.product.findOne({'_id':productid}).exec().then();
        //     if(product) fn.m.dynamicProduct.user.showProduct(userid, product);
        // }
        // //advice
}

var showFactor = async function(userid,  option)
{
    var botusername = global.robot.username;
    var factor = null;

    //get factor
    if(option.factor) factor = option.factor;
    else if(option.id) 
        factor = await fn.db.factor.findOne({'_id': option.id}).exec().then();

    if(!factor) return;
    
    //peyment
    var query = fn.mstr.bag.query;
    var peyLink = 'https://nextpay.ir/';
    var fn_detail = query['bag'] + '-' + query['user'] + '-' + query['itemsdetail'] + '-' + option.factor.id;
    var detailArr = [];


    //detail item
    //detailArr.push([ {'text': 'نمایش جزئیات آیتم های فاکتور', 'callback_data': fn_detail} ]);

    //show
    var paidText = (factor.ispaid) ? '✅ ' + 'پرداخت شد' : '🚫 ' + 'پرداخت نشده است.'
    var mess = factor.desc + '\n\n' + paidText;
    mess += '\n\n @' + botusername;

    //gates
    if(!factor.ispaid)
    {
        //controller
        var fn_getpaid = query['bag'] + '-' + query['user'] + '-' + query['getpaid'] + '-' + option.factor.id;
        var fn_delete = query['bag'] + '-' + query['user'] + '-' + query['deletefactor'] + '-' + option.factor.id;
        detailArr.push([
            {'text': 'پرداخت آزمایشی', 'callback_data': fn_getpaid},
            {'text': 'حذف فاکتور', 'callback_data': fn_delete}
        ]);

        //gates buttons
        var nextpaylink = await fn.m.bag.gates.nextpay.getPaylink(factor.number, factor.amount);
        detailArr.push([{'text': 'پرداخت با نکست پی', 'url': nextpaylink}]);
    }
    
    //sned
    global.robot.bot.sendMessage(userid, mess, {
        'parse_mode':'HTML',
        "reply_markup" : {"inline_keyboard" : detailArr}
    }).then((msg) => { });
}

var routting = function(message, speratedSection, user)
{
    var text = message.text;

    //show list
    if(text === fn.mstr.bag.btns_user['factor']) show(message.from.id);

    //show a factor
    else {
        var fnumber = null; 
        try {
            fnumber = parseInt(text.split(' - ')[1]);
        } catch (error) {
            
        }
        
        if(!fnumber) {show(message.from.id,  fn.mstr.bag.mess['notafactor']); return;}

        fn.db.factor.findOne({'number': fnumber}).exec((e, factor) => {
            if(factor) showFactor(message.from.id,  {'factor': factor});
            else show(message.from.id,  fn.mstr.bag.mess['notafactor']);
        });
    }
}

module.exports = { routting, show, showFactor, create, showfactorItems, getPaied }