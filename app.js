var tcms = require('telegram-cms');

var option = require('./config');
option.fn = {}

// start bot
tcms.start(option);

// start express
//require('./express/bin/www');