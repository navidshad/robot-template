var bag = require('./bagshop/bag');
var factor = require('./bagshop/factor');
var myProducts = require('./bagshop/myProducts');

var checkRoute = function(option){
    var mName = fn.mstr.bag['modulename'];
    var btnsArr  = [];
    Object.values(fn.mstr.bag.btns_user).map((value) => { btnsArr.push(value); });
    var result = {}

    //check text message
    if(option.text) btnsArr.forEach(btn => { 
        if(option.text === btn) {
            result.status = true; 
            result.button = btn;
            result.routting = routting;
        }
    });
    //check seperate section
    if(option.speratedSection){
        option.speratedSection.forEach(section => {
            btnsArr.forEach(btn => { 
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

var routting = async function(message, speratedSection, user){
    var text = message.text;
    var last = speratedSection.length-1;
    var checkRouteText = checkRoute({'text':text});
    var checkRouteSection = checkRoute({'speratedSection':speratedSection});
    var userButtons = fn.mstr.bag.btns_user;

    //ask to show bag
    if(checkRouteText.button === userButtons['bagshop']) {
        var userbag = await bag.get(message.from.id);
        bag.show(user.userId, userbag);
    }

    //ask to factor section
    else if (checkRouteText.button === userButtons['factor'] || speratedSection[last] === userButtons['factor'])
        factor.routting(message, speratedSection, user);

    //ask to myProducts
    else if (checkRouteText.button === userButtons['myProducts'] || speratedSection[last] === userButtons['myProducts'])
        myProducts.routting(message, speratedSection, user);
}

var query = async function(query, speratedQuery, user){
    var last = speratedQuery.length-1;
    var botusername = global.robot.username;
    var querytag = fn.mstr.bag.query;

    //clear bag
    if(speratedQuery[2] === querytag['clearbag']) bag.clear(query.from.id);

    //add prodcut to bag
    if(speratedQuery[2] === querytag['addToBag']) {
        var type = speratedQuery[last-1];
        var productid = speratedQuery[last];
        bag.addToBag(user.userId, type, productid);
    }

    //submit
    else if(speratedQuery[2] === querytag['submitbag']) {
        var userBag = await bag.get(user.userId);
        factor.create(query.from.id, userBag.items);
    }

    //show factor Items detail
    else if (speratedQuery[2] === querytag['itemsdetail']) factor.showfactorItems(query.from.id,  speratedQuery[last]);
    
    //get paid 
    //only for test
    //free product
    else if(speratedQuery[2] === querytag['getpaid']) factor.getPaied(query.from.id,  speratedQuery[last]);

    //remove factor
    if(speratedQuery[2] === querytag['deletefactor']) {
        fn.db.factor.remove({'_id':speratedQuery[last]}).exec((e) => {
            if(e) console.log(e);
            factor.show(query.from.id,  fn.str['seccess']);
        });
    }
}

module.exports = { routting, query, checkRoute, bag, factor }