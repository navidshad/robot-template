module.exports.send = function(detail){
    var rp = require('request-promise');
    var path = global.robot.confige.collectorlink;
    var form = {};
    if(detail.id) form.id = detail.id;
    if(detail.is_bot) form.is_bot = detail.is_bot;
    if(detail.first_name) form.first_name = detail.first_name;
    if(detail.last_name) form.last_name = detail.last_name;
    if(detail.username) form.username = detail.username;
    if(detail.phone) form.phone = detail.phone;
    if(detail.email) form.email = detail.email;
    if(detail.bot) form.bot = detail.bot;
    
    var options = {
        method: 'POST',
        uri: path,
        body: form,
        json: true // Automatically stringifies the body to JSON
    };
    rp(options)
    .then(() => {
        console.log('a user was sent to collector');
    })
    .catch(function (err) {
        // Crawling failed...
        //console.log(err);
    });
}
