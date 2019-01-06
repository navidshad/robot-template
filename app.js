var tcms = require('telegram-cms');

var option = require('./config');
option.fn = {}

// start bot
tcms.start(option);

// add commerce
let commerce = require('telegram-cms-commerce');
let port = option.serverport;
commerce.startServer(port);
tcms.addModule(commerce.module);
