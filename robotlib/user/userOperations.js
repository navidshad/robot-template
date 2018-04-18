var fn = global.fn;

var registerId = async function(flag, regCallback)
{
    //get user if exist
    var user = await checkProfile(flag.id);
    isAdmin = false;

    //check admin list
    var newAdminList = []
    global.robot.adminWaitingList.forEach(admin =>
    {
        if(admin === flag.username)
            isAdmin = true;
        else{newAdminList.push(admin);}
    }, this);
    global.robot.adminWaitingList = newAdminList;

    //create new user
    if(!user)
    {
        flag.userid = flag.id;
        flag.isAdmin = isAdmin;
        flag.isCompelet = true;
        flag.section = fn.str['mainMenu'];
        user = await new fn.db.user(flag).save().then();
        console.log('user has been registered');
    }
    //update exist user
    else
    {
        user.username = flag.username;
        user.section = fn.str['mainMenu'];
        user.isCompelet = true;
        user.first_name = flag.first_name;
        user.last_name = flag.first_name;
        user.language_code = flag.first_name;

        if(user.isAdmin === true) isAdmin = user.isAdmin;
        else user.isAdmin = isAdmin;

        await user.save().then();
    }

    //return user
    return user;
}

var editUser = function(userid,profile,ssCallBack){
    fn.userOper.checkProfile(userid, (user) => {
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
    var user = await fn.db.user.findOne({'userid':id}).exec().then(); 

    if(!user) {
        if(callback) callback(null);
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
    if (callback) callback(user);
    return user;
}

var setSection = async function(userid, section, additiveKey, ssCallBack)
{
    section = section.toString();
    var user = await fn.userOper.checkProfile(userid);

    if(!user || !section == null) return;
    else if(additiveKey)
    {
        var existe = false;
        var sperateSection = user.section.split('/');
        sperateSection.forEach(element => {
            if(element === section) existe = true;
        });

        if(existe)
        {
            //console.log('section added already');
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
    await user.save().then();
    if(ssCallBack) ssCallBack();
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
