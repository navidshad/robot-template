var description = function(query, speratedQuery){
    console.log('get new description of post');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr['category']['name'] + '/' + fn.mstr.category.maincategory + '/' + fn.mstr.category.edit['description'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.category.edit['description'], fn.generateKeyboard({section:fn.mstr['category']['name']}, true));
}

var order = function(query, speratedQuery){
    console.log('get new order');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] +  '/' + fn.mstr['category']['name'] + '/' + fn.mstr.category.maincategory + '/' + fn.mstr.category.edit['order'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.category.edit['order'], fn.generateKeyboard({section:fn.mstr['category']['back']}, true));
}

var parent = function (query, speratedQuery){
    console.log('get new parent of post');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] +  '/' + fn.mstr['category']['name'] + '/' + fn.mstr['category'].maincategory + '/' + fn.mstr['category'].edit['parent'] + '/' + speratedQuery[speratedQuery.length-1], false);
    var back = fn.mstr['category']['back'];
    var list = [];
    global.robot.category.forEach(function(element) { list.push(element.parent + ' - ' + element.name); }, this);
    global.robot.bot.sendMessage(query.from.id, fn.mstr['category'].edit['parent'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

module.exports = function(query, speratedQuery){
    
    //remove query message
    global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);

    //edit name
    if(speratedQuery[1] === global.fn.mstr.category['queryCategoryName']){
        console.log('get new title of post');
        fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] +  '/' + fn.mstr['category']['name'] + '/' + fn.mstr['category'].maincategory + '/'  + fn.mstr['category'].edit['name'] + '/' + speratedQuery[speratedQuery.length-1], false);
        global.robot.bot.sendMessage(query.from.id, fn.mstr['category'].edit['name'], fn.generateKeyboard({section: fn.mstr['category']['back']}, true));
    }

    //edit description
    else if(speratedQuery[1] === global.fn.mstr.category['queryCategoryDescription']) description(query, speratedQuery);
    //edit parent
    else if(speratedQuery[1] === global.fn.mstr.category['queryCategoryParent']) parent(query, speratedQuery);
    //edit order
    else if(speratedQuery[1] === global.fn.mstr.category['queryOrder']) order(query, speratedQuery);

    //delete message
    else if(speratedQuery[1] === global.fn.mstr.category['queryDelete']){
        fn.db.category.findOne({'_id': speratedQuery[speratedQuery.length-1]}, function(err, cat){
            if(cat) {
                fn.m.category.deleteCategory.clear(cat.name, () => {
                    global.robot.bot.sendMessage(query.from.id, fn.str['seccess']);
                    global.fn.updateBotContent();
                });
            }
        });
    }
    
}