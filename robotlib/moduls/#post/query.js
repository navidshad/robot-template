var checkQuery = function(option){

    var btnsArr  = [ 
        fn.mstr.post.query['post']
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

    //checl seperate section
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

var uploadSection = function(query,speratedQuery){
    console.log('get post file');
    fn.userOper.setSection(query.from.id, fn.str.query['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post['endupload'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['upload'], fn.generateKeyboard({section:fn.mstr.post['endupload']}, true));
}

var attachSection = function(query,speratedQuery){
    console.log('get attachment');
    var markup = fn.generateKeyboard({section:fn.mstr.post['endAttach']}, true);
    var newSection = fn.str.query['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post['endAttach'] + '/' + speratedQuery[speratedQuery.length-1];
    fn.userOper.setSection(query.from.id, newSection, false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['attach'], markup);
}

var removeattachment = function(query,speratedQuery){
    var last = speratedQuery.length-1;
    console.log('remove attachment');
    var newSection = fn.str.query['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr.post['name'];
    fn.userOper.setSection(query.from.id, newSection, false);
    fn.m.post.editpost(speratedQuery[last-1], {'removeAttachment': speratedQuery[last]}, query.from.id)
}

var description = function(query, speratedQuery){
    console.log('get new title of post');
    fn.userOper.setSection(query.from.id, fn.str.query['mainMenu'] + '/' + fn.str.goToAdmin['name']  + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post.edit['description'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['description'], fn.generateKeyboard({section:fn.mstr.post['name']}, true));
}

var order = function(query, speratedQuery){
    console.log('get new order');
    fn.userOper.setSection(query.from.id, fn.str.query['mainMenu'] + '/' + fn.str.goToAdmin['name']  + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post.edit['order'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['order'], fn.generateKeyboard({section:fn.mstr['post']['back']}, true));
}

var category = function (query, speratedQuery){
    console.log('get new category of post');
    fn.userOper.setSection(query.from.id, fn.str.query['mainMenu'] + '/' + fn.str.goToAdmin['name']  + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post.edit['category'] + '/' + speratedQuery[speratedQuery.length-1], false);
    var back = fn.mstr.post['back'];
    var list = [];
    global.robot.category.forEach(function(element) { list.push(element.parent + ' - ' + element.name); }, this);
    global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['category'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

var routting = function(query, speratedQuery){
    var queryTag = global.fn.mstr.post.query;

    //remove query message
    global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);

    //choose a type
    if(speratedQuery[2].includes('format')){
        var type = speratedQuery[2].replace('format', '').trim();
        console.log('format query', type);
        fn.m.post.editpost(speratedQuery[speratedQuery.length-1], {'type': type, 'publish': fn.str['NotPublished']}, query.from.id);
    }
  
      //is product
    if(speratedQuery[2] === queryTag['isproduct']){
        fn.m.post.editpost(speratedQuery[speratedQuery.length-1], {'isproduct': true, 'publish': fn.str['NotPublished']}, query.from.id);
    }

    //edit name
    if(speratedQuery[2] === queryTag['name']){
        console.log('get new title of post');
        fn.userOper.setSection(query.from.id, fn.str.query['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr['post']['name'] + '/' + fn.mstr.post.edit['name'] + '/' + speratedQuery[speratedQuery.length-1], false);
        global.robot.bot.sendMessage(query.from.id, fn.mstr.post.edit['name'], fn.generateKeyboard({section:fn.mstr['post']['name']}, true));
    }

    //edit description
    else if(speratedQuery[2] === queryTag['description']) description(query, speratedQuery);
    //edit category
    else if(speratedQuery[2] === queryTag['category']) category(query, speratedQuery);
    //upload
    else if(speratedQuery[2] === global.fn.str.query['upload']) uploadSection(query,speratedQuery)
    //edit order
    else if(speratedQuery[2] === global.fn.str.query['queryOrder']) order(query, speratedQuery);
    
    //publication
    if(speratedQuery[2] === fn.str.query['delete']){
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
                        //fn.userOper.setSection(query.from.id, fn.str.query['mainMenu'] + '/' + fn.str.goToAdmin['name']  + '/' + fn.mstr.post['name'] + '/' + fn.mstr.post.edit['publication'] + '/' + speratedQuery[speratedQuery.length-1], false);
                        fn.m.post.editpost(speratedQuery[speratedQuery.length-1], {'publish': 'switch'}, query.from.id);
                    }
                }
            }
            else{ console.log('item wasnt found')}
        });
    }

    //delete message
    else if(speratedQuery[2] === global.fn.str.query['delete']){
        fn.db.post.remove({'_id': speratedQuery[speratedQuery.length-1]}, function(err){
            global.fn.m.post.showPostList(query.from.id, fn.str.query['seccess']);
            global.fn.updateBotContent();
        });
    }

    //attaching
    else if(speratedQuery[2] === global.fn.str.query['attach']) attachSection(query,speratedQuery)
    else if(speratedQuery[2] === fn.str.query['removeAttachment']) removeattachment(query,speratedQuery);
}

module.exports = { checkQuery, routting } 