var WooCommerceAPI = require('woocommerce-api');
var WooCommerceOption = {
    url: 'https://example.com',
    consumerKey: 'consumer_key',
    consumerSecret: 'consumer_secret',
    //wpAPI: true,
    version: 'v3'
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

var getFromWoocom = async function(userid, WooCommerce, endPoint, parameters)
{
    var tempEndpoint = endPoint;
    if(parameters) tempEndpoint += parametersToString(parameters);

    var result = await WooCommerce.getAsync(tempEndpoint).then();
    var body = JSON.parse(result.body);

    //404 is missing or dosint exist
    if(body.code != 404 && body.message) global.robot.bot.sendMessage(userid, body.message);
    else return body;
}

var getCategories = async function(userid, WooCommerce, optionparam)
{
    var option = (optionparam) ? optionparam : {};
    var categories = await getFromWoocom(userid, WooCommerce, 'products/categories');
    categories = categories.product_categories;
    var result = [];
    categories.forEach(cat => 
    {
        //if(cat.parent == parentid) result.push(cat);

        //retrive by parentid
        var parentKey = (option.parentid == null) ? true : false;
        if(!parentKey && cat.parent == option.parentid) 
            parentKey = true;

        //retive by catid
        var catidKey = (option.categoryid == null) ? true : false;
        if(!catidKey && cat.id == option.categoryid) 
            catidKey = true;

        //retrive by name
        var keynam = (option.name == null) ? true : false;
        if(!keynam && cat.name == option.name) 
            keynam = true;

        //join to result
        if(parentKey && catidKey && keynam) result.push(cat);
    });
    
    return result;
}

var getProducts = async function(userid, WooCommerce, paramenters, optionparam)
{
    var option = (optionparam) ? optionparam : {};
    var products = await getFromWoocom(userid, WooCommerce, 'products', paramenters);
    products = products.products;

    var result = [];
    products.forEach(product => 
    {
        // //retrive by name
        // var catKey = (option.categoryid) ? false : true;
        // if(!catKey) product.categories.forEach(id => { if( id == categoryid) catKey = true; });

        //retrive by name
        var keynam = (option.name) ? false : true;
        if(!keynam && product.name == option.name) keynam = true;

        //join to result
        if(keynam) result.push(product);
    });

    return result;
}

var showDirectory = async function(userid, WooCommerce, category, optionparam)
{
    var option = (optionparam) ? optionparam : {};

    var catDistnation = null;
    if(option.main) catDistnation = {'name': option.main, 'description':'', 'id':0};
    else catDistnation = category;
    var categoryid = catDistnation.id;

    //get subcats
    var categories = await getCategories(userid, WooCommerce, {'parentid':categoryid});
    
    //get subproducts
    //main cat is 0, if request is for main cat, products will not be used
    var products = [];
    if(categoryid !== 0) 
        products = await getProducts(userid, WooCommerce, {'filter[category]': catDistnation.name}, {'cateogryid':catDistnation.id});

    var list = [];
    categories.forEach(cat => { list.push(cat.name); });
    products.forEach(pro => { list.push(pro.title); });

    if(list.length == 0)
    {
        global.robot.bot.sendMessage(userid, 'هیچ محصولی در این دسته بندی اضافه نشده است.');
        return
    }

    var back = fn.mstr['category']['backtoParent'];
    var remarkup = fn.generateKeyboard({'custom':true, 'grid':true, 'list':list, 'back':back}, false);

    var mess = (catDistnation.description.length > 0) ? catDistnation.description : catDistnation.name;
    global.robot.bot.sendMessage(userid, mess, remarkup);
    fn.userOper.setSection(userid, categoryid, true);
}

var showMain = async function(userid, WooCommerce, button)
{
    await fn.userOper.setSection(userid, button, true);
    showDirectory(userid, WooCommerce, 0, {'main': button});
}

var showProduct = async function(userid, WooCommerce, categoryid, text)
{
    var striptags = require('striptags');
    var pCat = await getFromWoocom (userid, WooCommerce, 'products/categories/' + categoryid);
    pCat = pCat.product_category;

    var products = await getProducts(userid, WooCommerce, {'filter[category]': pCat.name}, {'categoryid':categoryid});
    if(!products) return;

    var currencyData = fn.getModuleData('woocommerce', 'currency');
    var currency = (currencyData.value) ? currencyData.value : 'تومان';

    products.forEach(product => 
    {
        var mess = striptags(product.title);
        mess += '\n' + striptags(product.short_description);
        mess += '\n قیمت: ' + product.price + ' ' + currency;
        //image
        if(product.images.length > 0) mess += '\n\n' + product.images[0].src;

        var linkbtn = {'text': 'نمایش و خرید در سایت', 'url': product.permalink};
        var op = {"reply_markup" : {"inline_keyboard" : [[linkbtn]]}};
        global.robot.bot.sendMessage(userid, mess, op);
    });
}

var routting = async function(message, speratedSection, user, mName)
{
    var text = message.text;
    var last = speratedSection.length-1;
    var userid = message.from.id;
    var button = fn.getModuleData(mName, 'menuItem').value;
    var url = fn.getModuleData(mName, 'url');
    var consumerKey = fn.getModuleData(mName, 'consumerKey');
    var consumerSecret = fn.getModuleData(mName, 'consumerSecret');

    var back = fn.mstr['category']['backtoParent'];

    if(!url || !consumerKey || !consumerSecret) {
        global.robot.bot.sendMessage(userid, fn.mstr[mName].mess['neddOption']);
        return;
    }

    WooCommerceOption.url = url.value;
    WooCommerceOption.consumerKey = consumerKey.value;
    WooCommerceOption.consumerSecret = consumerSecret.value;

    var WooCommerce = new WooCommerceAPI(WooCommerceOption);

    //show main
    if (message.text === button) showMain(userid, WooCommerce, button);

    //back
    else if(text == back)
    {
        //backup to botcat
        if(speratedSection[last] == button)
        {
            var splicedSection = speratedSection.splice(last-1, 1);
            fn.menu.backtoParent(message, splicedSection, user);
            return;
        }

        //back up to parent Woocat
        var upid = (speratedSection[last] == button) ? 0 : parseInt(speratedSection[last]);
        var op = (upid == 0) ? {'main': button} : {};
        var upcat = await getFromWoocom (userid, WooCommerce, 'products/categories/' + upid);
        upcat = upcat.product_category;
        showDirectory(userid, WooCommerce, upcat, op);
    }

    //choose
    else
    {
        var parentid = (speratedSection[last] == button) ? 0 : parseInt(speratedSection[last]);
        var categories = await getCategories(userid, WooCommerce, {'name': text, 'parentid':parentid});

        if(categories.length > 0) showDirectory(userid, WooCommerce, categories[0]);
        //else if(categories.length == 0) showMain(userid, WooCommerce, button);
        else showProduct(userid, WooCommerce, parentid, text);
    }
}

module.exports = { routting, checkRoute }