var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bagitem = new Schema({
    'name'  :String,
    'id'    :String,
    'type'  :String,
    'price' :Number,
    'data'  :[{'key': String, 'value': String}]
});

var bagSchema = new Schema({
    'userid'        : Number,
    'message_id'    : Number, 
    'chatid'        : Number, 
    'page'          : Number,
    'items'         : [bagitem],
    'boughtItems'   : [bagitem],
    'address'       : String,
});
  
var factorSchema = new Schema({
    'number'    : Number,
    'userid'    : Number,
    'date'      : Date,
    'desc'      : String,
    'products'  : [bagitem],
    'amount'    : Number,
    'message_id': Number,
    'chatid'    : Number,
    'trans_id'  : String,
    'code'      : String,
    'ispaid'    : Boolean,
});

var fNumberSchema = new Schema({
    'last': {'type': Number, default: 100}
})

module.exports.bag     = mongoose.model('bags', bagSchema);
module.exports.factor  = mongoose.model('factors', factorSchema);
module.exports.fnumber  = mongoose.model('fNumber', fNumberSchema);