var show = async function(message, postName, user, optionPrams, callback)
{
    var option = (optionPrams) ? optionPrams : {};
    var post = await fn.db.post.findOne({'name': postName, 'publish': true}).exec().then();

    //nothing
    if(!post) {
        if(callback) callback(user);
        return;
    }

    //inline buttuns
    var detailArr = [];
    var query = fn.mstr.commerce.query;
    var fn_addToBag = query['commerce'] + '-' + query['user'] + '-' + query['addToBag'] + '-' + 'post' + '-' + post.id;
    
    if(post.isproduct) {
        var isbought = await fn.m.commerce.user.bag.checkBoughtItem(user.userid, post.id);
        if(!isbought) 
            detailArr.push([ {'text': 'افزودن به سبد', 'callback_data': fn_addToBag} ]);   
    }

    //like button 
    var like = await fn.m.favorites.user.getbutton(user.userid, 'post', post.id);
    if(like) detailArr.push([like]);

    var description = post.description + '\n @' +  global.robot.username;
    var markup = {'inline_keyboard': detailArr};
    var option = {'caption' : description, 'reply_markup': markup};

    //send post
    switch (post.type) {
        case fn.mstr.post.types['text'].name:
            console.log('send text post');
            global.robot.bot.sendMessage(message.from.id, description, option)
            .then((msg) => {
                snedAttachmentArray(message, post.attachments, 0);
            });
            break;
        case fn.mstr.post.types['file'].name:
            console.log('send file post');
            global.robot.bot.sendDocument(message.chat.id, post.fileid, option)
            .then((msg) => {
                snedAttachmentArray(message, post.attachments, 0);
            });
            break;
        case fn.mstr.post.types['photo'].name:
            console.log('send photo post');
            global.robot.bot.sendPhoto(message.chat.id, post.photoid, option)
            .then((msg) => {
                snedAttachmentArray(message, post.attachments, 0);
            });
            break;
            
        case fn.mstr.post.types['sound'].name:
            console.log('send sound post');
            global.robot.bot.sendAudio(message.chat.id,post.audioid, option)
            .then((msg) => {
                snedAttachmentArray(message, post.attachments, 0);
            });
            break;

        case fn.mstr.post.types['video'].name:
            console.log('send video post');
            global.robot.bot.sendVideo(message.chat.id,post.videoid, option)
            .then((msg) => {
                snedAttachmentArray(message, post.attachments, 0);
            });
            break;
    }
}

var snedAttachmentArray = function(message, attachments, number){
    //return 0
    if(attachments.length === 0) return;
    
    var nextItem = number +1;
    console.log('attachment length ', attachments.length, number);
    send(message, attachments[number].id, attachments[number].type, attachments[number].caption, () => {
    if(attachments.length > nextItem) snedAttachmentArray(message, attachments, nextItem);
  });
}

//send an attachment item
var send = function(message, resid, type, caption, callback){
    switch (type) {
        case fn.mstr.post.types['file'].name:
            global.robot.bot.sendDocument(message.chat.id, resid, {'caption':caption})
            .then(() => { if(callback) callback() });               
            break;
        case fn.mstr.post.types['photo'].name:
            global.robot.bot.sendPhoto(message.chat.id, resid, {'caption':caption})
            .then(() => { if(callback) callback() });
            break;
        case fn.mstr.post.types['sound'].name:
            global.robot.bot.sendAudio(message.chat.id, resid, {'caption':caption})
            .then(() => { if(callback) callback() });
            break;
        case fn.mstr.post.types['video'].name:
            global.robot.bot.sendVideo(message.chat.id, resid, {'caption':caption})
            .then(() => { if(callback) callback() });
            break;
    }
}

module.exports = { show, snedAttachmentArray }
