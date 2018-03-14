fn = global.fn;

var routting = function(query){
    var speratedQuery = query.data.split('-');

    //get user detail
    fn.userOper.checkProfile(query.from.id, (user) => 
    {
        if(!user) return;

        //define query route
        global.mRoutes.forEach(route => {
            var result = (route.query) ? route.query({'speratedSection': speratedQuery}) : {'status': false};
            if(result.status) {
                result.routting(query, speratedQuery, user);
                nothingToRoute = false;
                return;
            }
        });
    });
}

module.exports = {
    routting
}