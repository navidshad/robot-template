var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inboxSchema = new Schema({
  readed      : Boolean,
  messId      : String,
  date        : String,
  userId      : Number,
  username    : String,
  fullname    : String,
  message     : String,
});

module.exports.inbox = mongoose.model('inbox', inboxSchema);