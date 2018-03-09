var routting = function(message, speratedSection, user){
    console.log('free strings');
    var last = speratedSection.length-1;
    var text = message.text;

    //nothing
    global.robot.bot.sendMessage(message.from.id, 'لطفا از گزینه های ربات استفاده کنید.');
}

module.exports = {routting}