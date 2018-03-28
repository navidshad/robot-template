var soap = require('soap');
var key = global.confige.nextpey_api_key;
var callback_uri = global.confige.nextpey_callback_uri;

var GetToken = function (order_id, amount, callback) {
    var url = 'https://api.nextpay.org/gateway/token.wsdl';
    var payload = {
        'api_key': key,
        'order_id': order_id,
        'amount': amount,
        'callback_uri': global.configue.nextpey_callback_uri
    };
    soap.createClient(url, function(err, client) {
        client.TokenGenerator(payload, function(err, result) {
            if(callback) callback({'result':result.TokenGeneratorResult,'url':'https://api.nextpay.org/gateway/payment/'})
            /*
                if(result.TokenGeneratorResult.code == -1){
                    console.log(result.TokenGeneratorResult.trans_id);
                    //return result.TokenGeneratorResult.trans_id;
                    // redirect to 'https://api.nextpay.org/gateway/payment/'+result.TokenGeneratorResult.trans_id
                }else {
                    console.log('Err: ' + result.TokenGeneratorResult.code);
                    //return false;
                }
            */
        });
    });
};


var VerifyPayment = function(trans_id, order_id, amount, callback){
    // trans_id and order_id will POST to callback_uri
    var url = 'https://api.nextpay.org/gateway/verify.wsdl';
    var payload = {
        'api_key'   : key,
        'trans_id'  : trans_id,
        'order_id'  : order_id,
        'amount'    : amount
    };
    soap.createClient(url, function(err, client) {
        client.PaymentVerification(payload, function(err, result) {
            /*
                if(result.PaymentVerificationResult.code == 0){
                    console.log('Paied: ' + result.PaymentVerificationResult.code);
                    return true;
                }else {
                    console.log('Not verified: ' + result.PaymentVerificationResult.code);
                    return false;
                }
            */
            if(callback) callback (result);
        });
    });
};

module.exports = {GetToken, VerifyPayment}