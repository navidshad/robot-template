var soap = require('soap');
//var key = global.confige.nextpey_api_key;
var callback_uri = global.config.nextpey_callback_uri;

var GetToken = async function (order_id, amount, key) {
    var url = 'https://api.nextpay.org/gateway/token.wsdl';
    var payload = {
        'api_key': key,
        'order_id': order_id,
        'amount': amount,
        'callback_uri': callback_uri
    };

    var client = await soap.createClientAsync(url).then();
    return client.TokenGeneratorAsync(payload).then();
};


var VerifyPayment = async function(trans_id, order_id, amount, key){
    // trans_id and order_id will POST to callback_uri
    var url = 'https://api.nextpay.org/gateway/verify.wsdl';
    var payload = {
        'api_key'   : key,
        'trans_id'  : trans_id,
        'order_id'  : order_id,
        'amount'    : amount
    };

    // soap.createClient(url, function(err, client) {
    //     client.PaymentVerification(payload, function(err, result) {
    //         /*
    //             if(result.PaymentVerificationResult.code == 0){
    //                 console.log('Paied: ' + result.PaymentVerificationResult.code);
    //                 return true;
    //             }else {
    //                 console.log('Not verified: ' + result.PaymentVerificationResult.code);
    //                 return false;
    //             }
    //         */
    //         if(callback) callback (result);
    //     });
    // });

    var client = await soap.createClientAsync(url).then();
    client.TokenGenerator(payload, function(err, result) 
    {
        return new Promise((resolve, reject) => 
        {
            if(err) reject(err);
            else resolve(result);
        });
    });
};

var getPaylink = async function(fnumber, amount)
{
    //get session
    var session = null;
    session = await fn.db.nextpay.findOne({'order_id': fnumber}).exec().then();
    if(!session) session = await new fn.db.nextpay({'order_id': fnumber, 'amount': amount}).save().then();
    else session.amount = amount;

    //get nextpay api key
    var nextpayapikey = fn.getModuleData(fn.mstr.bag['modulename'], 'nextpayapikey');
    nextpayapikey = (nextpayapikey) ? nextpayapikey.value : '...';

    //get new token
    return await GetToken(fnumber, amount, nextpayapikey)
    .then(async (result) => 
    {
        var TokenGeneratorResult = result.TokenGeneratorResult;

        //return fake url
        if(TokenGeneratorResult.code !== -1) {
            console.log('nextpay error: ' + result.TokenGeneratorResult.code);
            return 'https://api.nextpay.org/gateway/payment/***';
        }

        //save
        session.trans_id = TokenGeneratorResult.trans_id;
        session.code = TokenGeneratorResult.code;
        await session.save().then();

        //return url
        var url = 'https://api.nextpay.org/gateway/payment/' + session.trans_id;
        return url;
    })
    .catch(e => 
    {
        console.log(e);
        return 'https://api.nextpay.org/gateway/payment/***';
    });
}
module.exports = { GetToken, VerifyPayment, getPaylink }