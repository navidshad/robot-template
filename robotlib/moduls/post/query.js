var uploadSection = function(query,speratedQuery){
    console.log('get post file');
    fn.m.post.editpost(speratedQuery[speratedQuery.length-1], {'clearalbum': true}, query.from.id);
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post['endupload'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['upload'], fn.generateKeyboard({section:fn.mstr.post['endupload']}, true));
}

var attachSection = function(query,speratedQuery){
    console.log('get attachment');
    var markup = fn.generateKeyboard({section:fn.mstr.post['endAttach']}, true);
    var newSection = fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post['endAttach'] + '/' + speratedQuery[speratedQuery.length-1];
    fn.userOper.setSection(query.from.id, newSection, false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['attach'], markup);
}

var removeattachment = function(query,speratedQuery){
    var last = speratedQuery.length-1;
    console.log('remove attachment');
    var newSection = fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr.post['name'];
    fn.userOper.setSection(query.from.id, newSection, false);
    fn.m.post.editpost(speratedQuery[last-1], {'removeAttachment': speratedQuery[last]}, query.from.id)
}

var description = function(query, speratedQuery){
    console.log('get new title of post');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name']  + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post.edit['description'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['description'], fn.generateKeyboard({section:fn.mstr.post['name']}, true));
}

var order = function(query, speratedQuery){
    console.log('get new order');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name']  + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post.edit['order'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['order'], fn.generateKeyboard({section:fn.mstr['post']['back']}, true));
}

var category = function (query, speratedQuery){
    console.log('get new category of post');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name']  + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post.edit['category'] + '/' + speratedQuery[speratedQuery.length-1], false);
    var back = fn.mstr.post['back'];
    var list = [];
    global.robot.category.forEach(function(element) { list.push(element.parent + ' - ' + element.name); }, this);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['category'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

module.exports = function(query, speratedQuery){
    //remove query message
    global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);

    //choose a type
    if(speratedQuery[1].includes('format')){
        var type = speratedQuery[1].replace('format', '').trim();
        console.log('format query', type);
        fn.m.post.editpost(speratedQuery[speratedQuery.length-1], {'type': type, 'publish': fn.str['NotPublished']}, query.from.id);
    }

    //edit name
    if(speratedQuery[1] === global.fn.mstr.post['queryPostName']){
        console.log('get new title of post');
        fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr['post']['name'] + '/' + fn.mstr.post.edit['name'] + '/' + speratedQuery[speratedQuery.length-1], false);
        global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['name'], fn.generateKeyboard({section:fn.mstr['post']['name']}, true));
    }

    //edit description
    else if(speratedQuery[1] === global.fn.mstr.post['queryPostDescription']) description(query, speratedQuery);
    //edit category
    else if(speratedQuery[1] === global.fn.mstr.post['queryPostCategory']) category(query, speratedQuery);
    //upload
    else if(speratedQuery[1] === global.fn.str['queryUpload']) uploadSection(query,speratedQuery)
    //edit order
    else if(speratedQuery[1] === global.fn.str['queryOrder']) order(query, speratedQuery);
    
    //publication
    if(speratedQuery[1] === fn.str['queryPublication']){
        console.log('get resource price');
        fn.db.post.findOne({'_id': speratedQuery[speratedQuery.length-1]}, function(err, itm){
            if(itm){
                var allow = true;
                if(!itm.description){
                    allow = false;
                    global.robot.bot.sendMessage(query.from.id, 'لطفا قسمت توضیحاترا کامل کنید.');
                    description(query, speratedQuery);
                }
                else{
                    switch (itm.type) {
                        case 'file':
                            if(!itm.fileid){
                                allow = false;
                                global.robot.bot.sendMessage(query.from.id, 'ابتدا یک فایل پیوست کنید.');
                            }
                            break;
                
                        case 'photo':
                            if(!itm.photoid){
                                allow = false;
                                global.robot.bot.sendMessage(query.from.id, 'ابتدا یک تصویر پیوست کنید.');
                            }
                            break;
                
                        case 'audio':
                            if(!itm.audioid){
                                allow = false;
                                global.robot.bot.sendMessage(query.from.id, 'ابتدا یک فایل صوتی پیوست کنید.');
                            }
                            break;
                
                        case 'video':
                            if(!itm.videoid){                            
                                allow = false;
                                global.robot.bot.sendMessage(query.from.id, 'ابتدا یک فایل ویدیو پیوست کنید.');
                            }
                            break;
                    }

                    if(!allow) uploadSection(query, speratedQuery);                                        
                    else {
                        //fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name']  + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post.edit['publication'] + '/' + speratedQuery[speratedQuery.length-1], false);
                        fn.m.post.editpost(speratedQuery[speratedQuery.length-1], {'publish': 'switch'}, query.from.id);
                    }
                }
            }
            else{ console.log('item wasnt found')}
        });
    }

    //delete message
    else if(speratedQuery[1] === global.fn.str['queryDelete']){
        fn.db.post.remove({'_id': speratedQuery[speratedQuery.length-1]}, function(err){
            global.fn.m.post.showPostList(query.from.id, fn.str['seccess']);
            global.fn.updateBotContent();
        });
    }

    //attaching
    else if(speratedQuery[1] === global.fn.str['queryAttach']) attachSection(query,speratedQuery)
    else if(speratedQuery[1] === fn.str['queryRemoveAttach']) removeattachment(query,speratedQuery);
}