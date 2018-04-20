var create = async function(userid, option)
{
    //option must contains:
    //endDate, consumption, discountmode, amount, percent
    if(!option) return;

    //create
    var number = Date.today().getTime() / 1000;
    var code = `${userid}-${number}`;
    var coupon = new fn.db.coupon({
        'code'          : code,
        'userid'        : userid,
        'startDate'     : (option.startDate)    ? option.startDate      : Date.toDay(),
        'endDate'       : (option.endDate)      ? option.endDate        : Date.toDay().addDays(2),
        'consumption'   : (option.consumption)  ? option.consumption    : 1,
        'discountmode'  : (option.discountmode) ? option.discountmode   : 'amount',
        'amount'        : (option.amount)       ? option.amount         : 5000,
        'percent'       : (option.percent)      ? option.percent        : 20,
    });
    await coupon.save().then();

    //alert to user
    return coupon;
}

var getbycode = function(code)
{

}

var getbyuser = async function(userid)
{
    var coupons = await fn.db.coupon.find({'userid':userid}).exec().then();
    return coupons;
}

global.fn.eventEmitter.on('createCoupon', create);

module.exports = {  getbyuser }