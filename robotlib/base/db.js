var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//mongoose.set('debug', true);
mongoose.connect(global.config.dbpath);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log('db was connected'); });

//create schemas
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userId      : Number,
    username    : String,
    isAdmin     : Boolean,
    isCompelet  : Boolean,
    fullname    : String,
    phone       : Number,
    section     : String,
});

var data = new Schema({ 
  name:String, 
  value:String, 
  key: Boolean,
  more:[ {name:String, value:String, key: Boolean} ]
});

var ConfigSchema = new Schema({
  username      : String,
  firstmessage  : String,
  domain        : String,
  moduleOptions:[{
    name:String, 
    category:String, 
    active: Boolean, 
    button:String,
    buttons:[String],
    btn_order:Number,
    datas : [data]
  }]
});

var user     = mongoose.model('Users', UserSchema);
var config   = mongoose.model('config', ConfigSchema);

module.exports = {user, config};
