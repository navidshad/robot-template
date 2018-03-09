module.exports = function(){
    var request = require('request');
    
    url = 'https://holue.herokuapp.com/';
    
    var requestToURL = function(){
        request(url, function(error, response, body) {
            //console.log(new Date());
          });
        setTimeout(requestToURL, 60000);
    }
    
    setTimeout(requestToURL, 1500);
}