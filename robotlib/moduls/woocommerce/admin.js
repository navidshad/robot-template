var name = 'woocommerce';

var checkRoute = function(option)
{
    var btnsArr  = [
        fn.mstr[name]['name']
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

var show = function(userid)
{
    var titles = [
        fn.mstr[name].btns['settings'],
        fn.mstr[name].btns['backbtn']
    ];
    console.log(`got to ${name} section, ${titles}`);
    //show list
    var mess = fn.mstr[name]['name']
    var markup = fn.generateKeyboard({'custom':true, 'grid':true, 'list': titles, 'back':fn.str.goToAdmin['back']}, false);
    global.fn.sendMessage(userid, mess, markup);
    fn.userOper.setSection(userid, mess, true);
}

var routting = function(message, speratedSection, user)
{
    console.log('woocommerce admin section');
    var btns = fn.mstr[name].btns;

    //show section
    if(message.text === fn.mstr[name]['name'] || message.text === fn.mstr[name]['back'])
        show(message.from.id);

    //show setting
    else if(message.text === btns['settings'])
        settings.show(message.from.id, name);
    else if(speratedSection[3] === btns['settings'])
        settings.routting(message, speratedSection, user, name);

    //show back buttns
    else if(message.text === btns['backbtn'] || speratedSection[3] === btns['backbtn'])
        backbtns.routting(message, speratedSection, user, name);
}

var settings = require('./admin/settings');
var backbtns = require('./admin/backbtns');
var user = require('./user');
var query = require('./query');

module.exports = {
    name,
    checkRoute,
    routting,
    settings,
    backbtns,
    user,
    query,
    show,
}
