var routting = function(message, speratedSection, user){
    console.log('free strings');
    var last = speratedSection.length-1;
    var text = message.text;
    var nothingToRoute = true;

    global.mRoutes.forEach(route => {
        var result = (route.user) ? route.user({'text':text, 'speratedSection': speratedSection}) : {'status': false};
        if(result.status) {
            result.routting(message, speratedSection, user);
            nothingToRoute = false;
            return;
        }
    });

    //nothing
    if(nothingToRoute) global.robot.bot.sendMessage(message.from.id, 'لطفا از گزینه های ربات استفاده کنید.');
}

module.exports = {routting}