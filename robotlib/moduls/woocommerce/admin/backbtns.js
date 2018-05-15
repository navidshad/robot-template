var showitem = async function (userid, name) 
{
    var btn = await fn.db.wooBackbtn.findOne({'name': name}).exec().then();
    if(!btn) return;

   //create callback keyboard
   var detailArr = [];
   var qt = fn.mstr['woocommerce'].query;

   var fn_dest = qt['woocommerce'] + '-' + qt['admin'] + '-' + qt['backbtn'] + '-' + qt['destid'] + '-' + btn._id;
   var fn_cat  = qt['woocommerce'] + '-' + qt['admin'] + '-' + qt['backbtn'] + '-' + qt['category'] + '-' + btn._id;
   var fn_delete = qt['woocommerce'] + '-' + qt['admin'] + '-' + qt['backbtn'] + '-' + qt['delete'] + '-' + btn._id;

   //edit btns //publication btn
   detailArr.push([ 
        {'text': 'ای دی مقصد', 'callback_data': fn_dest},
        {'text': 'ای دی مبدا', 'callback_data': fn_cat},
        {'text': 'حذف', 'callback_data': fn_delete},
    ].reverse());

   //create message
   var text = 'اطلاعات دکمه' + '\n' +
   'ــــــــــــــــ' + '\n' +
   `🔶 نام: ${btn.name} \n` +
   `🔶 ای دی دسته مبدا: ${btn.catid} \n` +
   `🔶 ای دی دسته مقصد: ${btn.destid} \n` +
   'لطفا برای تنظیمات و ارسال نهایی از گزینه های زیر استفاده کنید.';
 
   global.robot.bot.sendMessage(userid, text, {"reply_markup" : {"inline_keyboard" : detailArr}});
}

var create = async function(userid, name)
{
    var symbol = fn.mstr['woocommerce']['symbol_back'];

    var hassymbol = name.includes(symbol);
    var existedbtn = await fn.db.wooBackbtn.count({'name': name}).exec().then();
 
    // error
    if(!hassymbol || existedbtn)
    {
        var mess = fn.mstr['woocommerce'].mess['getbackName'];
        global.robot.bot.sendMessage(userid, mess);
        return;
    }

    // creat new button
    var newBtn = {'name': name}; 
    await new fn.db.wooBackbtn(newBtn).save().then();
    show(userid, fn.mstr['seccess']);
}

var editItem = async function(id, detail, userid)
{
    var btn = await fn.db.wooBackbtn.findOne({'_id': id}).exec().then();
    
    if(!btn) 
    {
        show(message,'این پیام دیگر وجود ندارد');
        return;
    }

    if(detail.name) btn.name = detail.name;
    if(detail.catid) btn.catid = detail.catid;
    if(detail.destid) btn.destid = detail.destid;

    await btn.save().then();
    show(userid, fn.str['seccess']);
    showitem(userid, btn.name);

}

var show = async function(userid, txt)
{
    var titles = [[ fn.mstr['woocommerce'].btns['addbackbtn'] ]];
    var backbtns = await fn.db.wooBackbtn.find({}).sort('-_id').exec().then();
    
    //make title list
    backbtns.map(item => { titles.push(item.name); });

    var section = fn.mstr['woocommerce'].btns['backbtn'];
    var mess = (txt) ? txt : section;
    var back = fn.mstr['woocommerce'].back;
    var markup = global.fn.generateKeyboard({'custom': true, 'grid':false, 'list': titles, 'back':back}, false);
    global.robot.bot.sendMessage(userid, mess, markup);
    fn.userOper.setSection(userid, section, true);
}

var routting = function(message, speratedSection, user)
{
    var btns = fn.mstr['woocommerce'].btns;
    var text = message.text;
    var last = speratedSection.length-1;

    //ask to show section
    if (text === btns['backbtn'] || text === btns['backbtn_back'])
        show(message.from.id);

    //create new button
    else if (text === btns['addbackbtn'])
    {
        var mess = fn.mstr['woocommerce'].mess['getbackName'];
        var markup = fn.generateKeyboard({'section':fn.str.goToAdmin['back']}, true);
        global.robot.bot.sendMessage(message.from.id, mess, markup);
        fn.userOper.setSection(message.from.id, btns['addbackbtn'], true);
    }
    //get the title of new message
    else if(speratedSection[4] === btns['addbackbtn'])
        create(message.from.id, text);


    //edit category id
    else if(speratedSection[4] === fn.mstr['woocommerce'].sections['catid'])
        editItem(speratedSection[last], {catid: text}, message.from.id);

    //edit dest id
    else if(speratedSection[4] === fn.mstr['woocommerce'].sections['destid'])
        editItem(speratedSection[last], {destid: text}, message.from.id);

    //choose an button
    else showitem(message.from.id, text);
}

var query = async function(query, speratedQuery, user, mName)
{
    var last = speratedQuery.length-1;
    var queryTag = fn.mstr[mName].query;

    //edit catid
    if(speratedQuery[last-1] === queryTag['category'])
    {
        var nSection = fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr[mName].name + '/' + fn.mstr[mName].btns['backbtn'] + '/' + fn.mstr[mName].sections['catid'] + '/' + speratedQuery[last];
        var mess = fn.mstr[mName].mess['getcatid'];
        var markup = fn.generateKeyboard({section: fn.mstr[mName].btns['backbtn_back']}, true);
        
        global.robot.bot.sendMessage(query.from.id, mess, markup);
        fn.userOper.setSection(query.from.id, nSection, false);
    }

    //edit destid
    if(speratedQuery[last-1] === queryTag['destid'])
    {
        var nSection = fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr[mName].name + '/' + fn.mstr[mName].btns['backbtn'] + '/' + fn.mstr[mName].sections['destid'] + '/' + speratedQuery[last];
        var mess = fn.mstr[mName].mess['getdestid'];
        var markup = fn.generateKeyboard({section: fn.mstr[mName].btns['backbtn_back']}, true);
        
        global.robot.bot.sendMessage(query.from.id, mess, markup);
        fn.userOper.setSection(query.from.id, nSection, false);
    }

    //delete
    else if (speratedQuery[last-1] === queryTag['delete'])
    {
        var id = speratedQuery[last];
        await fn.db.wooBackbtn.remove({'_id': id}).then();
        show(query.from.id, fn.str['seccess']);
    }
}

module.exports = { routting, query }