fn = global.fn;
var postQuery       = require('../moduls/post/query');
var queryCategory   = require('../moduls/category/query');
var sendboxQuery    = require('../moduls/sendbox/query.js');
var inboxQuery      = require('../moduls/inbox/admin').query;

var analyze = function(query){
    var speratedQuery = query.data.split('-');
    //if post
    if(speratedQuery[0] === fn.mstr.post['queryPost']) postQuery(query, speratedQuery);
    //if category
    else if(speratedQuery[0] === fn.mstr.category['queryCategory']) queryCategory(query, speratedQuery);
    //if admin sendbox query
    else if(speratedQuery[0] === fn.mstr.sendMessage['queryAdminSndMess']) sendboxQuery(query, speratedQuery);
    //if admin inbox 
    else if (speratedQuery[0] === fn.mstr.inbox.query['inbox']) inboxQuery(query, speratedQuery);
}

module.exports = {
    analyze
}