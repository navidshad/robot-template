var checkQuery = function(option){

    var btnsArr  = [ 
        fn.mstr.pinker.query['pinker']
    ];

    var result = {}
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

var routting = function(query, speratedQuery, user, mName)
{
    var last = speratedQuery.length-1;
    
    //remove query message
    if(!speratedQuery[1] === fn.mstr.pinker.query['user'])
        global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);
        
    //answer
    if(speratedQuery[1] === fn.mstr.pinker.query['answer']) {
        fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr['pinker'].name + '/' + fn.mstr.pinker.mess['answer'] + '/' + speratedQuery[speratedQuery.length-1], false);
        global.robot.bot.sendMessage(query.from.id, fn.mstr.pinker.mess['answer'], fn.generateKeyboard({section:fn.mstr['pinker'].back}, true));
    }
    //delete message
    else if(speratedQuery[1] === fn.mstr.pinker.query['delete']) deleteMessage(query.from.id, {'id': speratedQuery[last]});

    //user
    else if(speratedQuery[1] === fn.mstr.pinker.query['user']) user.query(query, speratedQuery);
}

module.exports = { routting, checkQuery }