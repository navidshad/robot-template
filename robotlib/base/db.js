var mongoose = require('mongoose');
mongoose.connect(global.confige.dbpath);

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

var ConfigSchema = new Schema({
  username      : String,
  collectorlink : String,
  modules :{
    'settings':Boolean,
    'ticket': Boolean,
    'contacttousers': Boolean,
    'shop': Boolean
  },
  moduleOptions:[{
    name:String, 
    category:String, 
    active: Boolean, 
    button:String,
    btn_order:Number,
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
  category    :String,
  order       :Number,
  date        :String,
  description :String,

  type        :String,
  fileid      :String,
  photoid     :[String],
  audioid     :String,
  videoid     :String,
  thumbLink   :String,
  publish     :Boolean,
  attachments :[ attachment ],
});

var user      = mongoose.model('Users', UserSchema);
var inbox     = mongoose.model('inbox', inboxSchema);
var sendbox   = mongoose.model('sendBox', sendBoxSchema);
var confige   = mongoose.model('confige', ConfigSchema);
var category  = mongoose.model('categories', categorySchema);
var post      = mongoose.model('posts', postSchema);


module.exports = {user, inbox, sendbox, confige, category, post};
