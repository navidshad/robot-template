var showPostList = function(userid, injectedtext){
    fn.userOper.setSection(userid, fn.mstr.post['name'], true);
    var list = [fn.mstr.post.postOptions];
    var back = fn.str.goToAdmin['back'];
    var mess = (injectedtext) ? injectedtext : fn.mstr.post['name'];
    //find
    fn.db.post.find({}).select('name category').sort('-_id').exec((e, cats) => {
        if(cats && cats.length > 0) cats.forEach(function(element) { 
            var itemname = element.category + ' - ' + element.name;
            list.push(itemname); }, this);
        global.robot.bot.sendMessage(userid, mess, fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));        
    });
}

var createpostMess = function(userId, post){
        //create callback keyboard
        var detailArr = [];
        var fn_text     = fn.mstr.post['queryPost'] + '-' + fn.mstr.post['queryPostText'] + '-' + post._id;
        var fn_file     = fn.mstr.post['queryPost'] + '-' + fn.mstr.post['queryPostFile'] + '-' + post._id;
        var fn_photo    = fn.mstr.post['queryPost'] + '-' + fn.mstr.post['queryPostPhoto'] + '-' + post._id;
        var fn_sound    = fn.mstr.post['queryPost'] + '-' + fn.mstr.post['queryPostSound'] + '-' + post._id;
        var fn_video    = fn.mstr.post['queryPost'] + '-' + fn.mstr.post['queryPostVideo'] + '-' + post._id;
        
        var fn_attachment   = fn.mstr.post['queryPost'] + '-' + fn.str['queryAttach'] + '-' + post._id;
        var fn_upload       = fn.mstr.post['queryPost'] + '-' + fn.str['queryUpload'] + '-' + post._id;
        
        var fn_name         = fn.mstr.post['queryPost'] + '-' + fn.mstr.post['queryPostName'] + '-' + post._id;
        var fn_category     = fn.mstr.post['queryPost'] + '-' + fn.mstr.post['queryPostCategory'] + '-' + post._id;
        var fn_description  = fn.mstr.post['queryPost'] + '-' + fn.mstr.post['queryPostDescription'] + '-' + post._id;
        var fn_delete       = fn.mstr.post['queryPost'] + '-' + fn.str['queryDelete'] + '-' + post._id;
        var fn_publication  = fn.mstr.post['queryPost'] + '-' + fn.str['queryPublication'] + '-' + post._id;
        var fn_order        = fn.mstr.post['queryPost'] + '-' + fn.str['queryOrder'] + '-' + post._id;            
        var fn_close        = fn.mstr.post['queryPost'] + '-close';

        var tx_text =fn.mstr.post.types['text'].icon,
        tx_file     =fn.mstr.post.types['file'].icon,
        tx_photo    =fn.mstr.post.types['photo'].icon, 
        tx_sound    =fn.mstr.post.types['sound'].icon, 
        tx_video    =fn.mstr.post.types['video'].icon;
        
        console.log(post.type)
        if(post.type === 'text')       tx_text = tx_text + ' ' + fn.str['Published'];
        else if(post.type === 'file')  tx_file = tx_file + ' ' + fn.str['Published'];
        else if(post.type === 'photo') tx_photo = tx_photo + ' ' + fn.str['Published'];
        else if(post.type === 'sound') tx_sound = tx_sound + ' ' + fn.str['Published'];
        else if(post.type === 'video') tx_video = tx_video + ' ' + fn.str['Published'];

        //upload
        var tx_upload = 'آپلود';
        if(post.type === 'file'  && post.fileid)  tx_upload = 'آپلود' + fn.mstr.post.types['attached'];
        if(post.type === 'photo' && post.photoid && post.photoid.length > 0) tx_upload = 'آپلود' + fn.mstr.post.types['attached'];
        if(post.type === 'sound' && post.audioid) tx_upload = 'آپلود' + fn.mstr.post.types['attached'];
        if(post.type === 'video' && post.videoid) tx_upload = 'آپلود' + fn.mstr.post.types['attached']; 

        //publication
        var tx_publication = (post.publish) ? fn.str['Published'] +'منتشر شده' : fn.str['NotPublished'] +'منتشر نشده'

        detailArr.push([
            {'text': tx_text, 'callback_data': fn_text},
            {'text': tx_file, 'callback_data': fn_file},    
            {'text': tx_photo, 'callback_data': fn_photo},
            {'text': tx_sound, 'callback_data': fn_sound},
            {'text': tx_video, 'callback_data': fn_video}
        ]);

        if(post.type !== 'text') detailArr.push([{'text': tx_upload, 'callback_data': fn_upload}]);
        
        detailArr.push([ 
            {'text': 'دسته بندی', 'callback_data': fn_category},
            {'text': 'توضیح', 'callback_data': fn_description},
            {'text': 'نام', 'callback_data': fn_name}
        ]);

        detailArr.push([{'text': 'اولویت', 'callback_data': fn_order}]);

        detailArr.push([
            {'text': 'حذف', 'callback_data': fn_delete},
            {'text': 'بستن', 'callback_data': fn_close},
            {'text': tx_publication, 'callback_data': fn_publication}
        ]);

        //attachment 
        detailArr.push([{'text': 'پیوست', 'callback_data': fn_attachment}]);
        //attached fiels
        if(post.attachments) post.attachments.forEach((element, i) => {
            var fn_removeAttchment = fn.mstr.post['queryPost'] + '-' + fn.str['queryRemoveAttach'] + '-' + post._id + '-' + i;
            var row = [ {'text':'❌', 'callback_data':fn_removeAttchment},
                        {'text':element.name, 'callback_data':'nothing'} ];
            detailArr.push(row);
        });
   
       //create message
       var description='...', 
       title    = post.name, 
       category = post.category, 
       order = post.order,
       publish  = fn.str['NotPublished'] + ' منتشر نشده.';

       if(post.description) description = post.description;
       publish = (post.publish) ? fn.str['Published'] : fn.str['NotPublished'] + ' منتشر شده.';
   
       var text = 'اطلاعات مطلب' + '\n' +
       'ــــــــــــــــــــــــــــــــ' + '\n' +
       '⏺ ' + 'عنوان: ' + title + '\n' +
       '⏺ ' + 'دسته بندی: ' + category + '\n' +
       '⏺ ' + 'اولویت: ' + order + '\n' +
       '⏺ ' + 'وضعیت: ' + publish + '\n' + 
       'ــــــــــــــــــــــــــــــــ' + '\n' +
       '⏺ ' + 'توضیحات: ' + '\n' +
       description + '\n' + 
       'ــــــــــــــــــــــــــــــــ' + '\n' + 
       '⚠️' + 'برای ویرایش مطلب از دکمه های پیوست شده استفاده کنید.';
   
       //global.robot.bot.sendMessage(userId, fn.str['seccess'], fn.generateKeyboard({section:fn.str.goTopost[0]}, false));    
       showPostList(userId);
       global.robot.bot.sendMessage(userId, text, {"reply_markup" : {"inline_keyboard" : detailArr}});
}

var ceatePost = function(message){
    var newpost = new fn.db.post({
        'name': message.text,
        'category': fn.mstr.category['maincategory'],
        'order': 1,
        'type': 'text',
        'date': fn.time.gettime(),
        'publish': false
    });
    newpost.save(() => { 
        showPostList(message.from.id, fn.str['seccess']); 
        fn.updateBotContent();
    });
}

var editpost = function(id, detail, userId, ecCallBack){
    var sendKey = true;
    //console.log('edit a post', id);
    fn.db.post.findOne({"_id": id}, function(err, post){
        if(post){
            if(detail.name) post.name                       = detail.name;
            if(detail.category) post.category               = detail.category;
            if(detail.description) post.description         = detail.description;
            if(detail.type) post.type            = detail.type;
            if(detail.fileid) post.fileid        = detail.fileid;
            if(detail.audioid) post.audioid      = detail.audioid;
            if(detail.videoid) post.videoid      = detail.videoid;
            if(detail.thumbLink) post.thumbLink  = detail.thumbLink;
            if(detail.publish){
                if(detail.publish === fn.str['Published']) post.publish = true;
                else if(detail.publish === 'switch') post.publish       = !post.publish;
                else post.publish = false;
            }
            if(detail.order) post.order = detail.order;

            //attachment
            //add
            if(detail.attachment) {
                sendKey = false;
                if(!post.attachments.length === 0) post.attachments = [];
                post.attachments.push(detail.attachment);
            }
            //remove
            if(detail.removeAttachment) post.attachments.splice(parseInt(detail.removeAttachment), 1);

            //albums
            if(detail.clearalbum) {post.photoid = []; sendKey = false};
            if(detail.photoid){
                sendKey = false;
                //create media album for first time
                if(!post.photoid) post.photoid = [];
                //add photo to album
                var isnotadded = true;
                post.photoid.forEach(element => {
                    if(element === detail.photoid) isnotadded = false;
                });
                if(isnotadded) post.photoid.push(detail.photoid);
            }

            post.save((e) => {
                if(e) console.log(e);
                if(!detail.clearalbum) global.robot.bot.sendMessage(userId, fn.str['seccess']);
                if(sendKey) {
                    fn.userOper.setSection(userId, fn.mstr.post['name'], true);
                    createpostMess(userId, post);
                }
                global.fn.updateBotContent();
                if(ecCallBack) ecCallBack();
            });
        }
        else{
            global.robot.bot.sendMessage(userId, 'این مطلب دیگر وجود ندارد');
        }
    });
}

var upload = require('./upload.js');
var user   = require('./user');

var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;
    
    //show posts root
    if(text === fn.mstr.post['name'] || text === fn.mstr.post['back']) showPostList(message.from.id);

    //create new post
    else if(text === fn.mstr.post.postOptions[1]){
        var mess = fn.mstr.post.edit['newSCMess'];
        var back = fn.mstr.post['back'];
        
        fn.userOper.setSection(message.from.id, fn.mstr.post.postOptions[1], true);        
        global.robot.bot.sendMessage(message.from.id, mess, fn.generateKeyboard({'section': back}, true));
    }
    else if(speratedSection[last] === fn.mstr.post.postOptions[1]){
        if(fn.m.category.checkInValidCat(text)) global.robot.bot.sendMessage(message.from.id, fn.mstr.post.scErrors[0]);
        else if(fn.checkValidMessage(text)) global.robot.bot.sendMessage(message.from.id, fn.str['chooseOtherText']);
        else{
            fn.db.post.findOne({'name': text}).exec((e, post) => {
                if(!post) ceatePost(message);
                else global.robot.bot.sendMessage(message.from.id, fn.mstr.post.scErrors[1]);
            });
        }
    }

    //edit name
    else if(speratedSection[last-1] === fn.mstr.post.edit['name']){
        if(fn.m.category.checkInValidCat(text)) global.robot.bot.sendMessage(message.from.id, fn.mstr.post.scErrors[0]);
        else if(fn.checkValidMessage(text)) global.robot.bot.sendMessage(message.from.id, fn.str['chooseOtherText']);
        else{
            fn.db.post.findOne({'name': text}).exec((e, post) => {
                if(!post) editpost(speratedSection[last], {'name': text}, message.from.id);
                else global.robot.bot.sendMessage(message.from.id, fn.mstr.post.scErrors[1]);
            });
        }
    }

    //edit decription
    else if (speratedSection[last-1] === fn.mstr.post.edit['description']) 
        editpost(speratedSection[last], {'description': text}, message.from.id);

    //edit category
    else if (speratedSection[last-1] === fn.mstr.post.edit['category']){
        var cat = text.split(' - ')[1];
        if(fn.m.category.checkInValidCat(cat)) editpost(speratedSection[last], {'category': cat}, message.from.id);
        else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    }

    //edit order
    else if (speratedSection[last-1] === fn.mstr.post.edit['order']) 
        if(parseFloat(text) || text === 0) editpost(speratedSection[last], {'order': text}, message.from.id);
        else global.robot.bot.sendMessage(message.from.id, fn.mstr.post.edit['order']);                

    //end upload
    else if (speratedSection[last-1] === fn.mstr.post['endupload']){
        fn.db.post.findOne({'_id': speratedSection[last]}).exec((e, post) => {
            if(post) createpostMess(message.from.id, post);           
        });
    }

    else if (speratedSection[last-1] === fn.mstr.post['endAttach']){
        fn.db.post.findOne({'_id': speratedSection[last]}).exec((e, post) => {
            if(post) createpostMess(message.from.id, post);           
        });
    }

    //choose a post
    else {
        var postname = text.split(' - ')[1];
        fn.db.post.findOne({'name': postname}).exec((e, post) => {
            if(post) createpostMess(message.from.id, post);
            else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);            
        });
    }
}
module.exports = {routting, showPostList, editpost, upload, user}