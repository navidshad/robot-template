var create = async function(option)
{
    //option must contains:
    //endDate, consumption, discountmode, amount, percent
    if(!option) return;
    var coupon = null;
    var create = false;

    //check oneCoupons mode
    var oneCouponsOption = fn.getModuleData('commerce', 'oneCoupons');
    var optionValue = (oneCouponsOption) ? oneCouponsOption.value : '...';
    var oneCouponsMode = (optionValue == 'true') ? true : false;
    if(oneCouponsMode)
    //update last one
    {
        var discountmode = option.discountmode;
        coupon = await fn.db.coupon.findOne({'userid': option.userid,'discountmode':discountmode}).exec().then();
        
        if(!coupon) create = true;
        else {
            coupon.endDate = option.endDate.addDays(option.days).addHours(option.hours);
            coupon.consumption += (option.consumption > 1) ? option.consumption-1 : 0;
            await coupon.save().then();
        }
    }
    else create = true;

    // creat coupon
    if(create)
    {
        var number = Date.today().getTime() / 1000;
        var code = `u${option.userid}n${number}`;
        coupon = new fn.db.coupon({
            'code'          : code,
            'userid'        : option.userid,
            'startDate'     : (option.startDate)    ? option.startDate      : new Date(),
            'endDate'       : (option.endDate)      ? option.endDate        : new Date().addDays(2),
            'consumption'   : (option.consumption)  ? option.consumption    : 1,
            'consumptionway': (option.consumptionway)? option.consumptionway: 'custom',
            'discountmode'  : (option.discountmode) ? option.discountmode   : 'amount',
            'amount'        : (option.amount)       ? option.amount         : 5000,
            'percent'       : (option.percent)      ? option.percent        : 20,
        });
        await coupon.save().then();
    }

    //alert to user
    alertTouser(coupon)
}

var alertTouser = function(coupon)
{
    var mess = '💟 ' + 'کاربر عزیز یک بن تخفیف برای شما صادر شد: \n';
    mess += fn.m.commerce.coupon.getDetail(coupon);
    mess += '\n⚠️ برای استفاده از بن تخفیف به بخش ثبت سفارش مراجعه کنید.';
    global.fn.sendMessage(coupon.userid, mess);
    fn.alertadmins(mess);
}

global.fn.eventEmitter.on('createCoupon', create);

//#region utilities
var getcoupon = async function(cid)
{
    var coupon = await fn.db.coupon.findOne({'_id':cid}).exec().then();
    return coupon;
}

var removeCoupon = async function(cids)
{
    for (let index = 0; index < cids.length; index++) 
    {
        const cid = cids[index];
        var coupon = await getcoupon(cid);
        if(!coupon) continue;
    
        coupon.consumption -= 1;
        if(coupon.consumption <= 0) fn.db.coupon.remove({'_id':cid}).exec();
        else coupon.save().then();
    }
}

var getusercoupons = async function(userid)
{
    var coupons = await fn.db.coupon.find({'userid':userid, 'consumptionway':'custom'}).exec().then();
    return coupons;
}

var getCouponsDetail = function(coupons)
{
    var couponsText = '';
    coupons.forEach((coup, i) => {
        var num = i+1;
        var code = coup.code;
        var dis = (coup.discountmode == 'amount') ? coup.amount + ' تومان ' : coup.percent + ' درصد ';
        couponsText += num + ' 🏷 ' + ', ' + dis + 'تخفیف \n'; 
    });
    return couponsText;
}

var getUsedCouponsDetail = function(usedcoupons)
{
    var couponsText = '';
    usedcoupons.forEach(coup => { couponsText += `- ${coup.name} \n` });
    return couponsText;
}

var performCoupon = async function(userid, total, cid)
{
    // get automatics and the custom
    var result = {total: 0, usedcoupons: []}
    var coupons = await fn.db.coupon.find({'userid': userid, 'consumptionway':'automatic'}).exec().then();
    var customcoupon = await getcoupon(cid);
    if(customcoupon) coupons.push(customcoupon);

    var finaltotal = total;
    coupons.forEach(coupon => 
    {
        var detail = {id: coupon.id};
        var newtotal = 0;
        //amount
        if(coupon.discountmode == 'amount')
        {
            newtotal = finaltotal - coupon.amount;
            if(newtotal < 100) newtotal = 100;
            detail.name = coupon.amount + ' تومان';
        }
        //percent
        else if(coupon.discountmode == 'percent')
        {
            newtotal = finaltotal - ((finaltotal / 100) * coupon.percent);
            if(newtotal < 100) newtotal = 100;
            detail.name = coupon.percent + ' درصد';
        }

        finaltotal = newtotal;
        result.usedcoupons.push(detail);
    });

    //return
    result.total = finaltotal;
    return result;
}

var getDetail = function(coupon)
{
    var amount = (coupon.discountmode == 'amount') ? `${coupon.amount} تومان` : `${coupon.percent} درصد`;
    var mess = '';
    mess += '✴️ ' + `کد بن: ${coupon.code} \n`;
    mess += '✴️ ' + `کد کاربر: ${coupon.userid} \n`;
    mess += '✴️ ' + `تاریخ امروز: ${coupon.startDate.toString('M/d/yyyy')} \n`;
    mess += '✴️ ' + `تاریخ پایان: ${coupon.endDate.toString('M/d/yyyy')} \n`;
    mess += '✴️ ' + `مقدار: ${amount} تخفیف \n`;
    return mess;
}
//#endregion

module.exports = {  
    getusercoupons, getCouponsDetail, 
    getcoupon, removeCoupon, 
    performCoupon, getUsedCouponsDetail,
    getDetail 
}