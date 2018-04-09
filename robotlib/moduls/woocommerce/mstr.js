var name = require('./admin').name;
var tx_name = 'ووکامرس';

var mstr = {
    modulename: name,
    //admin
    name:'☸️ ' + tx_name, 
    back:'⤴️ برگشت به ' + tx_name,

    btns: {
        settings : '⚙️' + ' - ' + 'تنظیمات',
        backsetting: '⤴️ برگشت به ' + '⚙️' + ' - ' + 'تنظیمات',
    },

    btns_user: {
    },

    query : {
        admin       : 'a',
        user        : 'u',
        settings    : 'stings',
        activation  : 'activate',
        category    : 'category',
        order       : 'order',
    },

    sections: {
        'main': name,
    },

    mess : {
        neddOption:'تنظیمات ووکامرس هنوز کامل انجام نشده است. لطفا تنظیمات را چک کنید.',
    },

    datas: {
        currency: {
            'name': 'واحد پولی',
            'mess': 'لطفا برچسب واحد پول را وارد کنید، این برچسب در کنار قیمت محصولات نمایش داده می شود. مثال: تومان',
        },
        menuItem: {
            'name': 'نام گزینه در منو',
            'mess': 'لطفا نام گزینه ای که میخواهید به عنوان بخش ووکامرسی خود برای کاربران نمایش داده شود، ارسال کنید.',
        },
        url: {
            'name': 'آدرس فروشگاه',
            'mess': 'لطفا آدرس فروشگله خود را وارد کنید. مثال: http://yourdomain.ir',
        },
        consumerKey: {
            'name': 'کلید مصرف کننده',
            'mess': 'لطفا کلید مصرف کننده خود را وارد کنید.',
        },
        consumerSecret: {
            'name': 'رمز مصرف کننده',
            'mess': 'لطفا کلید امنیت خود را وارد کنید.',
        },
    }
}

mstr.query[name] = name;

module.exports[name] = Object.create(mstr);