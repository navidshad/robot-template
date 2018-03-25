var mongoose = require('mongoose');
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

var inboxSchema = new Schema({
  readed      : Boolean,
  messId      : String,
  date        : String,
  userId      : Number,
  username    : String,
  fullname    : String,
  message     : String,
});

var sendBoxSchema = new Schema({
  date        : String,
  title       : String,
  text        : String,
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
  moduleOptions:[{
    name:String, 
    category:String, 
    active: Boolean, 
    button:String,
    btn_order:Number,
    datas : [data]
  }]
});

var categorySchema = new Schema({
  name:String,
  parent:String,
  description: String,
  order:Number
});

var attachment = new Schema({
  'name':String, 
  'type':String, 
  'id':String,
  'caption':String,
});

var postSchema = new Schema({
  name        :String,
  isproduct   :{'type':Boolean, 'default':false},
  price       :{'type':Number, 'default':1000},
  category    :String,
  order       :Number,
  date        :String,
  description :String,

  type        :String,
  fileid      :String,
  photoid     :String,
  audioid     :String,
  videoid     :String,
  thumbLink   :String,
  publish     :Boolean,
  attachments :[ attachment ],
});

var wordSchema = new Schema({
  userid: Number,
  word: String,
})

var user      = mongoose.model('Users', UserSchema);
var inbox     = mongoose.model('inbox', inboxSchema);
var sendbox   = mongoose.model('sendBox', sendBoxSchema);
var confige   = mongoose.model('confige', ConfigSchema);
var category  = mongoose.model('categories', categorySchema);
var post      = mongoose.model('posts', postSchema);
var word      = mongoose.model('words', wordSchema);


module.exports = {user, inbox, sendbox, confige, category, post, word};
