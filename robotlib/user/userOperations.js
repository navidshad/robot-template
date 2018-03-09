fn = global.fn;

var registerId = function(id, flag, regCallback){
    fn.userOper.checkProfile(id, (user) => {
        isAdmin = false;
        var newAdminList = []
        global.robot.adminWaitingList.forEach(function(admin) {
            if(admin === flag.username)
                isAdmin = true;
            else{newAdminList.push(admin);}
        }, this);
        global.robot.adminWaitingList = newAdminList;

        if(!user){
            var newuser = new fn.db.user({
                userId  : id,
                'username': flag.username,
                'fullname': flag.fullname,
                section : fn.str['mainMenu'],
                'isAdmin': isAdmin,
                isCompelet:true
            });
            //set invitor id
            if(flag.invitor) newuser.invitorId = flag.invitor;
            newuser.save(() => {
                console.log('user has been registered');
            });
        }
        else{
            user.section = fn.str['mainMenu'];
            user.isCompelet = true;
            user.fullname = flag.fullname;
            user.username = flag.username;

            if(user.isAdmin === true){
                isAdmin = user.isAdmin;
            }
            else{
                user.isAdmin = isAdmin;
            }
            user.save();
        }
        regCallback(isAdmin);
    });
}

var editUser = function(userId,profile,ssCallBack){
    fn.userOper.checkProfile(userId, (user) => {
        if(profile.isCompelet) user.isCompelet = true;
        if(profile.fullname) user.fullname = profile.fullname;
        if(profile.phone) user.phone = profile.phone;
        user.save(() => {
            if(ssCallBack) 
                ssCallBack();
        });
    });
}

var checkProfile = function(id, callback){
    fn.db.user.findOne({'userId':id}).exec((e, user) => {
        if(user && callback) callback(user);
        else if (callback) callback(null);
    });
}

var setSection = function(userId, section, additiveKey, ssCallBack){
    fn.userOper.checkProfile(userId, (user) => {
        if(!user || !section) return;
        else if(additiveKey){
            if(user.section.includes(section)){
                //console.log('section added already');
                var sperateSection = user.section.split('/');
                var newSections = '';
                for(var i=0; i<sperateSection.length; i++){
                    if(i>0)
                        newSections += '/';
                    newSections += sperateSection[i];
                    if(sperateSection[i] === section)
                        break;
                }
                user.section = newSections;
            }
            else{
                //console.log('section wasnt added already', section);
                user.section += '/' + section;
            }
        }
        else{user.section = section;}
        user.save(() => {
            if(ssCallBack) 
                ssCallBack();
        });
    });
}

var addAdminToWaintingList = function(username){
    global.robot.adminWaitingList.push(username);
    console.log('an admin was aded', username, global.robot.adminWaitingList);
}

module.exports = {
    registerId, checkProfile, 
    setSection, editUser,
    addAdminToWaintingList,
}
