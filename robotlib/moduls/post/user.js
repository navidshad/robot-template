var show = function(message, postName, user, callback){
    fn.db.post.findOne({'name': postName, 'publish': true}).exec((e, post) =>{
        if(post){
            //send post
            var description = post.description + '\n @' +  global.robot.username;
            switch (post.type) {
                case fn.mstr.post.types['text'].name:
                    global.robot.bot.sendMessage(message.from.id, description)
                    .then((msg) => {
                      snedAttachmentArray(message, post.attachments, 0);
                    });
                    break;
                case fn.mstr.post.types['file'].name:
                    global.robot.bot.sendDocument(message.chat.id, post.fileid, {caption : description})
                    .then((msg) => {
                      snedAttachmentArray(message, post.attachments, 0);
                    });
                    break;
                case fn.mstr.post.types['photo'].name:
                    post.photoid.forEach((element, i) => {
                        setTimeout(() => {
                            global.robot.bot.sendPhoto(message.chat.id, element, {caption : description})
                            .then((msg) => {
                              if(i === post.photoid.length-1);
                              snedAttachmentArray(message, post.attachments, 0);
                            });
                        }, 300);
                    });
                    break;
                    
                case fn.mstr.post.types['sound'].name:
                    global.robot.bot.sendAudio(message.chat.id,post.audioid, {caption : description})
                    .then((msg) => {
                      snedAttachmentArray(message, post.attachments, 0);
                    });
                    break;
        
                case fn.mstr.post.types['video'].name:
                    global.robot.bot.sendVideo(message.chat.id,post.videoid, {caption : description})
                    .then((msg) => {
                      snedAttachmentArray(message, post.attachments, 0);
                    });
                    break;
            }
        }
        else if(callback) callback(user);
    });
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

module.exports = {show}