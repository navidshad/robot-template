var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pinkerSchema = new Schema({
    readed      : Boolean,
    messId      : String,
    date        : String,
    userid      : Number,
    username    : String,
    fullname    : String,
    message     : String,
  });
  
var pinkerMessage = new Schema({text:String, from:Number});
var pinkerAnswerSchema = new Schema({
    senderid      : Number,
    reciverid     : Number,
    messages      : [pinkerMessage],
});

module.exports.pinker       = mongoose.model('pinks', pinkerSchema);
module.exports.pinkerAnswer = mongoose.model('pinkAnswers', pinkerAnswerSchema);