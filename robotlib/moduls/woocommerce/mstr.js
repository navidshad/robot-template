var name = require('./admin').name;
var tx_name = 'ووکامرس';

var mstr = {
    modulename: name,
    symbol:'☸️',
    symbol_back:'🔙',
    //admin
    name:'☸️ ' + tx_name, 
    back:'🔙 بازگشت به ' + tx_name,

    btns: {
        settings : '⚙️' + ' - ' + 'تنظیمات',
        backsetting: '🔙 بازگشت به ' + '⚙️' + ' - ' + 'تنظیمات',
        backbtn: '' + 'دکمه های بازگشت',
        backbtn_back: '🔙 بازگشت به ' + 'دکمه های بازگشت',
        addbackbtn: '' + 'افزودن دکمه',
    },

    btns_user: {
    },

    query : {
        admin       :'a',
        user        :'u',
        settings    :'stings',
        activation  :'activate',
        category    :'catry',
        order       :'order',

        //sale mode
        salemode    :'sm',
        buy         :'by',
        attribute   :'atr',
        attributeOption:'ato',
        addtobag    :'atbg',

        //backbtn
        backbtn     :'bbtn',
        delete      :'dlte',
        destid      :'destid',
    },

    sections: {
        main: name,
        catid: 'catid',
        destid:'destid',
    },

    mess : {
        neddOption:'تنظیمات ووکامرس هنوز کامل انجام نشده است. لطفا تنظیمات را چک کنید.',
        selectattr:'🎯 ' + 'لطفا قبل از ثبت محصول ویژگی های دلخواه خود را انتخاب کنید. بعد اقدام به ثبت کنید.',
        getbackName: 'لطفا نام دکمه بازگشت را وارد کنید، علامت زیر باید حتما در نام مورد نظر وجود داشته باشد: \n 🔙',
        getcatid:'لطفا ای دی دسته بندی که میخواهید دکم بازگشت در آن قرار بگیرد را وارد کنید.',
        getdestid:'لطفا ای دی دسته بندی مقصد را وارد کنید.',
    },

    datas: {
        saletype:{
            'name'  : 'نوع فروش محصولات',
            'mess'  : 'لطفا نوع تعامل ربات با فروشگاه خود را مشخص کنید.',
            'items' : [
                {'name': 'show', 'lable':'ارائه لینک محصول'},
                {'name': 'sale', 'lable':'فروش از طریق ربات'},
            ]
        },
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
        columns: {
            'name': 'تعداد ستون ها',
            'mess': 'لطفا تعداد ستون هایی که میخواهید برای نمایش محصولات استفاده شود، را وارد کنید.',
        },
    },

    //types
    types: {
        product:'wooproduct'
    }
}

mstr.query[name] = name;

module.exports[name] = Object.create(mstr);