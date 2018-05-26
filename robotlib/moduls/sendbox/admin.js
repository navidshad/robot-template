var name = 'sendbox';

var checkRoute = function(option){

    var btnsArr  = [ fn.mstr.sendMessage['name'] ];
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

var AdminMessageCreator = function (userid, mess, calbck) {
   //create callback keyboard
   var detailArr = [];
   var fn_editTitle = fn.mstr.sendMessage['queryAdminSndMess'] + '-' + fn.mstr.sendMessage['queryAdminSndMessEditTitle'] + '-' + mess._id;
   var fn_editText  = fn.mstr.sendMessage['queryAdminSndMess'] + '-' + fn.mstr.sendMessage['queryAdminSndMessEditMessage'] + '-' + mess._id;
   var fn_delete = fn.mstr.sendMessage['queryAdminSndMess'] + '-' + fn.mstr.sendMessage['queryAdminSndMessDel'] + '-' + mess._id;
   var fn_publication = fn.mstr.sendMessage['queryAdminSndMess'] + '-' + fn.mstr.sendMessage['queryAdminSndMessSend'] + '-' + mess._id;

   //edit btns //publication btn
   detailArr.push([ {'text': 'حذف', 'callback_data': fn_delete},
   {'text': 'بستن', 'callback_data': fn.mstr.sendMessage['queryAdminSndMess']},
   {'text': 'ارسال', 'callback_data': fn_publication},
   {'text': '📝 متن', 'callback_data': fn_editText}]);

   //create message
   var text = mess.title + '\n' +
   'ــــــــــــــــ' + '\n' +
   mess.text + '\n' + '\n' +
   'لطفا برای تنظیمات و ارسال نهایی از گزینه های زیر استفاده کنید.';
 
   global.fn.sendMessage(userid, text, {"reply_markup" : {"inline_keyboard" : detailArr}});   

   if(calbck) calbck();
}

var create = function(message){
    //check title to not to added already
    fn.db.sendbox.findOne({'title': message.text}, function(err, item){
        if(item) global.fn.sendMessage(message.from.id, fn.mstr.sendMessage['wrongtitle']);
        else{
            var newSendMess = new fn.db.sendbox({
                //'date'     : fn.time.gettime(),
                'title'     : message.text,
                'text'      : 'محتوای پیام'
            });
            newSendMess.save(() => {
                AdminMessageCreator(message.from.id, newSendMess);
                showSendBoxsection(message.from.id, fn.str['seccess']);
            });
        }
    });
}

var editMessage = function(id, detail, message, ecCallBack){
    //console.log('edit a course', id);
    fn.db.sendbox.findOne({"_id": id}, function(err, mess){
        if(mess){
            if(detail.text) mess.text = detail.text;
            if(detail.titel) mess.title = detail.title;
            showSendBoxsection(message, fn.str['seccess']);
            if(ecCallBack) AdminMessageCreator(message.from.id, mess, ecCallBack);
            else AdminMessageCreator(message.from.id, mess);
            mess.save();
        }
        else showSendBoxsection(message,'این پیام دیگر وجود ندارد');
    });
}

var showSendBoxsection = function(userid, txt){
    var titles = [[
        fn.mstr.sendMessage['sendMessToUsersDeleteAll'],
        fn.mstr.sendMessage['sendMessToUsersNewMess']
    ]];
    
    fn.db.sendbox.find({}).sort('_id').exec(function(err, items){
        //make title list
        if(items.length > 0){
            items.forEach(function(element) {
                titles.push(global.fn.mstr.sendMessage['sendboxSymbol'] + element.title);
            }, this);
        }

        fn.userOper.setSection(userid, fn.mstr['sendMessage'].name, true);  
        var messtosend = (txt) ? txt : fn.mstr['sendMessage'].name;
        var back = fn.str.goToAdmin.back;
        global.fn.sendMessage(userid, messtosend, global.fn.generateKeyboard({'custom': true, 'grid':false, 'list': titles, 'back':back}, false));
    });
}

var routting = function(message, speratedSection, user){

    //ask to sendBox section
    if (message.text === fn.mstr['sendMessage'].name){
        console.log('go to sendbox section');
        showSendBoxsection(message.from.id);
    }

    //ask to new message
    else if (message.text === fn.mstr.sendMessage['sendMessToUsersNewMess']){
        console.log('getting message');
        fn.userOper.setSection(message.from.id, fn.mstr.sendMessage['sendMessToUsersNewMess'], true);        
        global.fn.sendMessage(message.from.id, fn.mstr.sendMessage['sendMessToUsersTitle'], fn.generateKeyboard({'section':fn.str.goToAdmin['back']}, true));
    }
    //get the title of new message
    else if(speratedSection[3] === fn.mstr.sendMessage['sendMessToUsersNewMess']){
        console.log('send admins message to users');
        create(message);
    }

    //delete all message
    else if (message.text === fn.mstr.sendMessage['sendMessToUsersDeleteAll']){
        fn.db.sendbox.remove({}, function(err){
            showSendBoxsection(message.from.id, fn.str['seccess']);        
        });
    }

    //edit message - callback query
    else if(speratedSection[3] === fn.mstr.sendMessage['sendMessToUsersEditMess']){
        console.log('edit message');
        editMessage(speratedSection[speratedSection.length-1], {text: message.text}, message);
    }

    //choose an old message
    else if(message.text.includes(fn.mstr.sendMessage['sendboxSymbol'])){
        console.log('this is a message');
        sendboxMessTitle = message.text.replace(fn.mstr.sendMessage['sendboxSymbol'], '').trim();

        //find message
        fn.db.sendbox.findOne({'title': sendboxMessTitle}, function(errr, mess){
            if(mess) AdminMessageCreator(message.from.id, mess);
        })
    }
}

var query = require('./query');

module.exports = { name, checkRoute, routting, query, showSendBoxsection, editMessage, AdminMessageCreator}