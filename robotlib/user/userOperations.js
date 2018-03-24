var fn = global.fn;

var registerId = async function(id, flag, regCallback)
{
    //get user if exist
    var user = await fn.userOper.checkProfile(id).then();
    isAdmin = false;

    //check admin list
    var newAdminList = []
    global.robot.adminWaitingList.forEach(function(admin) {
        if(admin === flag.username)
            isAdmin = true;
        else{newAdminList.push(admin);}
    }, this);
    global.robot.adminWaitingList = newAdminList;

    //create new user
    if(!user)
    {
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
        user = await newuser.save().then();
        console.log('user has been registered');
    }
    //update exist user
    else
    {
        user.section = fn.str['mainMenu'];
        user.isCompelet = true;
        user.fullname = flag.fullname;
        user.username = flag.username;

        if(user.isAdmin === true) isAdmin = user.isAdmin;
        else user.isAdmin = isAdmin;
        user.save();
    }

    //return user
    regCallback(user);
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

var checkProfile = async function(id, callback)
{
    var user = await fn.db.user.findOne({'userId':id}).exec().then(); 
    return new Promise((resolve, reject) => 
    {
        if(!user) {
            if(callback) callback(null);
            resolve(null);
            return;
        }

        var isMember = false;
        //when chanel checker is not active
        // if(fn.m.chanelChecker.isActive())
        // {
        //     var status = 'non';
        //     var chanel = await fn.m.chanelChecker.getUser(id);
        //     //console.log('chanel status: ', chanel);
        //     if(chanel) status = chanel.status;
    
        //     if(status === 'creator' || status === 'member')
        //     {
        //         isMember = true;
        //     }
        // }
    
        if(user) user.isMemberOfChannel = true; //isMember;
        resolve(user);
        if (callback) callback(user);
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
