var create = async function(option)
{
    //option must contains:
    //endDate, consumption, discountmode, amount, percent
    if(!option) return;

    //create
    var number = Date.today().getTime() / 1000;
    var code = `u${option.userid}n${number}`;
    var coupon = new fn.db.coupon({
        'code'          : code,
        'userid'        : option.userid,
        'startDate'     : (option.startDate)    ? option.startDate      : new Date(),
        'endDate'       : (option.endDate)      ? option.endDate        : new Date().addDays(2),
        'consumption'   : (option.consumption)  ? option.consumption    : 1,
        'discountmode'  : (option.discountmode) ? option.discountmode   : 'amount',
        'amount'        : (option.amount)       ? option.amount         : 5000,
        'percent'       : (option.percent)      ? option.percent        : 20,
    });
    await coupon.save().then();

    //alert to user
    return coupon;
}

global.fn.eventEmitter.on('createCoupon', create);

//#region utilities
var getcoupon = async function(cid)
{
    var coupon = await fn.db.coupon.findOne({'_id':cid}).exec().then();
    return coupon;
}
var removeCoupon = await function(cid)
{
    var coupon = await getcoupon(cid);
    if(!coupon) return;

    coupon.consumption += 1;
    if(coupon.consumption < 0) fn.db.coupon.remove({'_id':cid}).exec();
    else coupon.save().then();
}
var getusercoupons = async function(userid)
{
    var coupons = await fn.db.coupon.find({'userid':userid}).exec().then();
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
var performCoupon = async function(total, cid)
{
    var coupon = await getcoupon(cid);
    if(!coupon) return 0;

    var newtotal = 0;
    //amount
    if(coupon.discountmode == 'amount')
    {
        newtotal = total - coupon.amount;
        if(newtotal < 100) newtotal = 100;
    }
    //percent
    else if(coupon.discountmode == 'percent')
    {
        newtotal = total - ((total / 100) * coupon.percent);
        if(newtotal < 100) newtotal = 100;
    }
    //return
    return newtotal;
}
//#endregion

module.exports = {  getusercoupons, getCouponsDetail, getcoupon, removeCoupon, performCoupon }