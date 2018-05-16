var WooCommerceAPI = require('woocommerce-api');
var WooCommerceOption = {
    url: 'https://example.com',
    consumerKey: 'consumer_key',
    consumerSecret: 'consumer_secret',
    wpAPI: true,
    version: 'wc/v2'
};

var checkRoute = function(option)
{
    var mName   = option.mName;
    var button = fn.getModuleData(mName, 'menuItem').value;
    var btnsArr  = [button];

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

var getWooCommerceAPI = function(userid)
{
    var mName = 'woocommerce';
    var url = fn.getModuleData(mName, 'url');
    var consumerKey = fn.getModuleData(mName, 'consumerKey');
    var consumerSecret = fn.getModuleData(mName, 'consumerSecret');

    if(!url || !consumerKey || !consumerSecret) {
        global.robot.bot.sendMessage(userid, fn.mstr[mName].mess['neddOption']);
        return;
    }

    WooCommerceOption.url = url.value;
    WooCommerceOption.consumerKey = consumerKey.value;
    WooCommerceOption.consumerSecret = consumerSecret.value;

    var WooCommerce = new WooCommerceAPI(WooCommerceOption);
    return WooCommerce;
}

var parametersToString = function(parameters){
    const queryString = require('query-string');
    var query = '?' + queryString.stringify(parameters);
    // var parametersArr = Object.keys(parameters);
    // parametersArr.forEach((key, i) => {
    //     queryString += key + '=' + parameters[key];
    //     if(i < parametersArr.length-1) queryString+= '&';
    // });
    return query;
}

var getFromWoocom = async function(userid, endPoint, parameters)
{
    var tempEndpoint = endPoint;
    if(parameters) tempEndpoint += parametersToString(parameters);
    tempEndpoint = encodeURI(tempEndpoint);

    var WooCommerce = getWooCommerceAPI(userid);
    var result = await WooCommerce.getAsync(tempEndpoint).then();
    var body = JSON.parse(result.body);

    //404 is missing or dosint exist
    if(body.code)
    {
      console.log('\x1b[31m',body.code, body.message);
      console.log('\x1b[33m%s\x1b[0m: ', tempEndpoint);
      global.robot.bot.sendMessage(userid, body.message);
    }

    else if(body.errors) global.robot.bot.sendMessage(userid, JSON.stringify(body.errors));
    else return body;
}

var getCategories = async function(userid, paramenters, optionparam)
{
    var option = (optionparam) ? optionparam : {};
    var categories = await getFromWoocom(userid, 'products/categories', paramenters);
    var result = [];
    categories.forEach(cat =>
    {
        //if(cat.parent == parentid) result.push(cat);

        //retrive by parentid
        // var parentKey = (paramenters.parent == null) ? true : false;
        // if(!parentKey && cat.parent == paramenters.parent)
        //     parentKey = true;

        //retive by catid
        var catidKey = (option.categoryid == null) ? true : false;
        if(!catidKey && cat.id == option.categoryid)
            catidKey = true;

        //retrive by name
        var keynam = (option.name == null) ? true : false;
        if(!keynam && cat.name == option.name)
            keynam = true;

        //join to result
        if(catidKey && keynam) result.push(cat);
    });

    return result;
}

var getProducts = async function(userid, paramenters, optionparam)
{
    var option = (optionparam) ? optionparam : {};
    var products = await getFromWoocom(userid, 'products', paramenters);

    var result = [];
    products.forEach(product =>
    {
        //scape products which are not subCat
        var cindex = product.categories.length-1;
        var keycat = (paramenters['category']) ? false : true;
        if(product.categories[cindex].id == paramenters['category'])
            keycat = true;

        //retrive by name
        var keynam = (option.name) ? false : true;
        if(!keynam && product.name == option.name) keynam = true;

        //join to result
        if(keycat && keynam) result.push(product);
    });

    return result;
}

var makebtntitle = function(product)
{
    var btn = product.name + ' ' + product.id;
    return btn;
}
var showDirectory = async function(user, category, page, optionparam)
{
    var option = (optionparam) ? optionparam : {};
    var userid = user.userid;
    var columns = fn.getModuleData('woocommerce', 'columns');
    columns = (columns) ? parseInt(columns.value) : 2;
    //console.log('columns', columns);

    var catDistnation = null;
    if(option.main || !category) catDistnation = {'name': option.main, 'description':'', 'id':0};
    else catDistnation = category;

    var categoryid = catDistnation.id;

    var categories = [];
    var products = [];

    // get subcats and products
    var p_categories = getCategories(userid, {'parent':categoryid, 'page': page, 'per_page': 10});
    var P_products = getProducts(userid, {'category': catDistnation.id, 'page': page, 'per_page': 10});

    console.log('categoryid', categoryid);

    var promissarr = [p_categories];
    // main cat is 0, if request is for main cat, products will not be used
    if(categoryid !== 0) promissarr.push(P_products)
    var result = await Promise.all(promissarr).then();

    categories = result[0];
    if(categoryid !== 0) products = result[1];

    var list = [];
    categories.forEach(cat => { list.push(cat.name); });
    products.forEach(pro => { list.push(makebtntitle(pro)); });

    var totalitems = categories.length + products.length;
    if(totalitems == 0)
    {
        global.robot.bot.sendMessage(userid, 'هیچ محصولی پیدا نشد.');
        return;
    }

    var back = fn.mstr['category']['backtoParent'];
    var remarkup = fn.generateKeyboard({'custom':true, 'grid':true, 'list':list}, false, columns);

    // navigator
    var nextp = page + 1;
    var backp = page -1;
    var navigator = ['⬅️ ' + ' صفحه ' + nextp];
    if(backp > 0) navigator.push(backp + ' صفحه ' + '➡️');
    remarkup.reply_markup.keyboard.push(navigator);

    // begin backs ---------------------------
    var backbtns = await fn.db.wooBackbtn.find().exec().then();
    var wooSection = fn.getModuleData('woocommerce', 'menuItem').value;

    var speratedSection = user.section.split('/');
    //speratedSection = speratedSection.slice(0, speratedSection.length-1);

    var extractedBacks = [];
    backbtns.map(item =>
    {
        var isSection = false;
        var weAreChild = false;
        var weAreRoot = false;
        var itemCatid = item.catid.toString();

        speratedSection.forEach(sec => { if(sec === itemCatid) isSection = true; });
        if(categoryid.toString() !== itemCatid && isSection) weAreChild = true;
        if(categoryid == 0) weAreRoot = true;

        if(weAreChild && !weAreRoot)
            extractedBacks.push(item.name);
    });

    if(extractedBacks.length) remarkup.reply_markup.keyboard.push(extractedBacks);
    remarkup.reply_markup.keyboard.push([back]);

    // end backs -----------------------------

    var mess = (catDistnation.description.length > 0) ? catDistnation.description : catDistnation.name;
    global.robot.bot.sendMessage(userid, mess, remarkup);
    fn.userOper.setSection(userid, categoryid, true);
}

var searchRoute = async function (userid, text)
{
    return new Promise(async (resolve, reject) =>
    {
        var products = await getProducts(userid, {'search': text});
        var reesult = {
            items: products,
            mName:'woocommerce',
            'makebtntitle': makebtntitle
        };
        resolve(reesult);
    });
}

var showMain = async function(user, button)
{
    await fn.userOper.setSection(user.userid, button, true);
    showDirectory(user, 0, 1, {'main': button});
}

var showProduct = async function(userid, mName, id=null, text)
{
    var pid = null;
    if(!id) {
        pid = text.split(' ');
        pid = pid[pid.length-1];
    }
    else pid = id;

    var product = await getFromWoocom (userid, 'products/' + pid);
    if(!product) return;

    //get sale type
    var saletype = fn.getModuleData('woocommerce', 'saletype');
    if(!saletype) saletype = 'show';

    var detailArr = [];
    if(saletype.value == 'show')
    {
        var linkbtn = [{'text': 'نمایش و خرید در سایت', 'url': product.permalink}];
        detailArr.push(linkbtn);
    }

    else if(saletype.value == 'sale')
    {
        var qt = fn.mstr[mName].query;
        var fx_buy = qt[mName] + '-' + qt['user'] + '-' + qt['salemode'] + '-' + qt['buy'] + '-' + product.id;
        var buy = [{'text': 'خرید', 'callback_data': fx_buy}];
        detailArr.push(buy);
    }

    //like button
    var pType = fn.mstr[mName].types['product'];
    var likebtn = await fn.m.favorites.user.getbutton(userid, pType, pid);

    if(likebtn) detailArr.push([likebtn]);

    //mess
    var mess = getProductDetail(product, {'image':true});

    //send
    var op = {"reply_markup" : {"inline_keyboard" : detailArr}};
    global.robot.bot.sendMessage(userid, mess, op);
}

var getProductDetail = function(product, optionparams)
{
    var option = (optionparams) ? optionparams : {};
    var striptags = require('striptags');

    //get currentcy
    var currencyData = fn.getModuleData('woocommerce', 'currency');
    var currency = (currencyData.value) ? currencyData.value : 'تومان';

    //atrrs
    var atrrsDetail = '';
    product.attributes.forEach(atrr => {
        atrrsDetail = '✴️ ' + atrr.name + ': ' + atrr.options + '\n';
    });

    //mess
    var title = '☸️ ' + striptags(product.name);
    var id = '🆔 ' + product.id;
    var description = '🔶 ' + striptags(product.short_description, '&nbsp;');
    var mess = title;
    mess += '\n' + description.trim();
    mess += '\n' + atrrsDetail;
    mess += '💵 قیمت: ' + product.price + ' ' + currency;
    mess += '\n' + id;
    //image
    if(option.image && product.images.length > 0) mess += '\n\n' + product.images[0].src;

    return mess;
}

var routting = async function(message, speratedSection, user, mName)
{
    var text = message.text;
    var last = speratedSection.length-1;
    var userid = message.from.id;
    var button = fn.getModuleData(mName, 'menuItem').value;
    var back = fn.mstr['category']['backtoParent'];

    //show main
    if (message.text === button) showMain(user, button);

    //back buttons
    var backbtns = await fn.db.wooBackbtn.find().exec().then();
    var backbtn = null;
    backbtns.map(item => { if(item.name === text) backbtn = item; });

    if(backbtn)
    {
        if(backbtn.destid == 0)
        {
            showMain(user, button);
            return;
        }

        var category = await getFromWoocom (userid, 'products/categories/' + backbtn.destid);
        if(category) showDirectory(user, category, 1);
        return;
    }

    //back
    if(text == back)
    {
        console.log('back to upcat woo')
        //backup to botcat
        if(speratedSection[last-1] == button)
        {
            var splicedSection = speratedSection.splice(last-1, 1);
            fn.menu.backtoParent(message, splicedSection, user);
            return;
        }

        //back up to parent Woocat
        var upid = (speratedSection[last-1] == button) ? 0 : parseInt(speratedSection[last-1]);
        var op = (upid == 0) ? {'main': button} : {};

        var upcat = {};
        if(upid !== 0) upcat = await getFromWoocom (userid, 'products/categories/' + upid);

        showDirectory(user, upcat, 1, op);
    }

    //navigator
    else if(text.includes(' صفحه ') && text.includes('⬅️') || text.includes('➡️'))
    {
        var page = 1;
        var split = text.split(' ');
        var slast = split.length-1;
        var back = parseInt(split[0]);
        var next = parseInt(split[slast]);

        if(!isNaN(back)) page = back;
        else if (!isNaN(next)) page = next;

        console.log('navigate woo ' + page);
        var upid = parseInt(speratedSection[last]);
        var category = await getFromWoocom (userid, 'products/categories/' + upid);

        showDirectory(user, category, page);
    }

    //choose item
    else
    {
        console.log('choose item woo')
        var parentid = (speratedSection[last] == button) ? 0 : parseInt(speratedSection[last]);
        var requests = {
            'categories'  : await getCategories(userid, {'parent':parentid}, {'name': text}),
            //'search'      : await getProducts(userid, {'search': text}),
        };

        await Promise.all([requests.requests, requests.search]);

        //show a category
        if(requests.categories.length > 0) showDirectory(user, requests.categories[0], 1);

        //show a product: name + id
        else showProduct(userid, mName, null, text);
    }
}

var salemode = require('./user/salemode');

module.exports = {
    routting, checkRoute,
    salemode, getProductDetail,
    getFromWoocom, getCategories, getProducts,
    searchRoute,
 }

// events -------------------------------
global.fn.eventEmitter.on('favliked', async (query, speratedQuery) =>
{
    var mName = 'woocommerce';
    var userid = query.from.id;
    var last = speratedQuery.length-1;
    var item = {}
    item.type = speratedQuery[last-1];
    item.id = speratedQuery[last];

    //get name
    var pType = fn.mstr[mName].types['product'];
    if(item.type === pType)
    {
        var product = await getFromWoocom(userid, 'products/' + item.id);
        if(!product) return;
        item.name = product.name;
    }

    fn.m.favorites.user.addremove(query, item);
});

global.fn.eventEmitter.on('favshowitem', async (userid, item) =>
{
    var mName = 'woocommerce';
    var pType = fn.mstr[mName].types['product'];
    if(item.type !== pType) return;

    showProduct(userid, mName, item.id);
});

global.fn.eventEmitter.on('searchshowitem', async (message, speratedSection) =>
{
    var mName = 'woocommerce';
    var symbol = fn.mstr[mName].symbol;
    var text = message.text;
    if(!text.startsWith(symbol)) return;

    message.text = message.text.replace(symbol, '');
    message.text = message.text.trim();
    showProduct(message.from.id, mName, null, message.text);
});
