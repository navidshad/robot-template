var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name:String,
  parent:String,
  description: String,
  order:Number
});

  module.exports.category = mongoose.model('categories', categorySchema);