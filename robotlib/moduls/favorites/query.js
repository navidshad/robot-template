var checkQuery = function(option){

    var btnsArr  = [ 
        fn.mstr.favorites.query['favorites']
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

var switchLike = async function(query, speratedQuery)
{
    var last = speratedQuery.length-1;
    var item = {}
    item.type = speratedQuery[last-1];
    item.id = speratedQuery[last];

    //get name
    if(item.type === fn.mstr.favorites.types['post'])
    {
        var post = await fn.db.post.findOne({'_id': item.id}).sort('name').exec().then();
        if(!post) return;
        item.name = post.name;
    }

    fn.m.favorites.user.addremove(query, item);
}

var routting = function(query, speratedQuery){
    var last = speratedQuery.length-1;
    var queryTag = fn.mstr.favorites.query;
    
    //remove query message
    global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);

    //switch like
    if(speratedQuery[2] === queryTag['like']) switchLike(query, speratedQuery);
}

module.exports = { routting, checkQuery }