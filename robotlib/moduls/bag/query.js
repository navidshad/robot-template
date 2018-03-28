var checkQuery = function(option){

    var btnsArr  = [ 
        fn.mstr.bag.query['bag']
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

var routting = function(query, speratedQuery, user){
    var last = speratedQuery.length-1;
    var botindex = query.botindex;

    //remove query message
    if(speratedQuery[2] !== fn.mstr.bag.query['itemsdetail'] && speratedQuery[2] !== fn.mstr.bag.query['postalInfo']) 
        global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);

    //if user
    if(speratedQuery[1] === fn.mstr.bag.query['user']) fn.m.bag.user.query(query, speratedQuery, user);
}

module.exports = { checkQuery, routting }