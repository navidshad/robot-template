var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attribute = new Schema({'name': String, 'value': String});
var wooSubmiterSchema = new Schema({
  userid    : Number,
  productid : Number,
  attributes: [attribute],
});

var wooBackbtns = new Schema({
  name: String,
  catid: Number,
  destid: Number,
});

module.exports.wooSubmiter = mongoose.model('wooSubmiters', wooSubmiterSchema);
module.exports.wooBackbtn  = mongoose.model('wooBackbtns', wooBackbtns);