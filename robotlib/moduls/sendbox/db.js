var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sendBoxSchema = new Schema({
  date        : String,
  title       : String,
  text        : String,
});

module.exports.sendbox = mongoose.model('sendBox', sendBoxSchema);