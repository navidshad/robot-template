var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attribute = new Schema({'name': String, 'value': String});
var wooSubmiterSchema = new Schema({
  userid    : Number,
  productid : Number,
  attributes: [attribute],
});

module.exports.wooSubmiter = mongoose.model('wooSubmiters', wooSubmiterSchema);