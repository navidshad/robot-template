module.exports.commerce = {
    modulename:'commerce',
    //admin
    name:'🏷💰 ' + 'تجارت', 
    back:'🔙 برگشت به تجارت',
    readSym: ['📪','📭'],
    settings : '⚙️' + ' - ' + 'تنظیمات',
    backsetting: '🔙 برگشت به ' + '⚙️' + ' - ' + 'تنظیمات',

    f_peied     : '✅',
    f_notpaid  : '☑️',

    //factor types
    factorTypes : {
        post:'post'
    },

    btns: {
        nextpay:'کلید api نکست پی',
        couponGenerators        :'🏷 ' + 'بن ساز ها',
        couponGeneratorsBack    :'🔙 ' + 'بن ساز ها',
        addgenerator            :'➕ ' + 'افزودن بن ساز',
    },

    //user
    btns_user:{
        bagshop: '📝 ' + 'ثبت  سفارش کالا 🛒',
        myProducts: '🛍 ' + 'خرید های من',
        factor: '📮 ' + 'فاکتورهای من',
    },

    query : {
        commerce : 'commerce',
        admin:'a',
        user : 'u',
        backtobag:'btb',
        submitbag: 'submitbag',
        usecoupon:'uc',
        coupon:'co',
        clearbag: 'clearbag',
        deletefactor: 'deletef',
        itemsdetail: 'itmdtl',
        close: 'close',
        getpaid: 'getpaid',
        addToBag:'addToBag',
        address:'address',
        phone:'phone',
        postalInfo:'postalInfo',

        //generator
        generator:'gen',
        sessions:'sessions',
        mode:'mode',
        discountmode:'discountmode',
        amount:'amount',
        percent:'percent',
        days:'days',
        hours:'hours',
        consumption:'consumption',
        status:'status',
        delete:'delete',
    },

    mess : {
      editbag:'⚠️ ' + 'لطفا برای حذف آیتم ها از کلید های زیر استفاده کنید.',
      notafactor:'همچین فاکتوری وجود ندارد لطفا از گزینه های زیر استفاده کنید.',
      alreadyAdded:'شما قبلا این محصول را به سبد خرید خود اضافه کرده اید.',
      getAddress:'لطفا آدرس پستی خود را به همراه کد پستی را ارسال کنید. \n نکته: کد پستی جهت سهلت در پروسه پست و تحویل کالا است و بهتر است آن را به همران آدرس پستی خود بنویسید.',
      getPhone:'لطفا از طریق دکمه زیر اجازه دهید شماره موبایل شما برای ما ارسال شود. \n برای سهولت در امر پست و تحویل کالا دسترسی به شماره تماس شما لازم است.',
      
      notGenerator:'این بن دیگر موجود نمیباشد لطفا از گزینه های زیر استفاده کنید.',
      getnameGenerator:'لطفا یک نام برای "بن ساز" انتخاب کنید.',

      getnextpayapikey:'لطفا کلید api درگاه نکست پی را ارسال کنید.'
    },

    //coupon
    discountmode: {
        amount      : 'amount',
        percent     : 'percent',
    },

    //coupon generator
    generator:{
        sessions: {
            'name': 'دوره',
            'mess': 'لطفا تعداد دوره را برای این بن ارسال کنید. دوره های تعداد کار های خاصی هستند که باید اتفاق بیوفتند تا یک بن صادر شود. برای مثال تعداد دوره در حالت "خرید کردن" منظور تعداد خرید های کاربر است، یا در حالت"عضویت کانال" تعداد روز هایی است که کاربر باید در کانال عضو باشد.',
            'type': Number,
        },

        mode:{
            'name'  : 'حالت',
            'mess'  : 'لطفا حالت استخراج بن ها را انتخاب کنید.',
            'items' : [
                {'name': 'buy',         'lable':'خرید کردن'},
                {'name': 'membership', 'lable':'عضویت در کانال'},
                {'name': 'invite', 'lable':'دعوت کاربران'},
            ],
        },

        discountmode: {
            'name': 'نوع تخفیف',
            'mess': 'لطفا حالت بن های تخفیف را مشخص کنید.',
            'items' : [
                {'name': 'amount', 'lable':'واحد پولی'},
                {'name': 'percent', 'lable':'درصد'},
            ]
        },

        amount:{
            'name': 'مقدار واحد پولی',
            'mess': 'چند هزار تومان به ازای هر بن، تخفیف داده شود؟',
            'type': Number,
        },

        percent:{
            'name': 'درصد تخفیف',
            'mess': 'چند درصد به ازای هر بن، تخفیف داده شود؟',
            'type': Number,
        },

        days:{
            'name': 'تعداد روز',
            'mess': 'هر بن تخفیف چند روز تاریخ مصرف دارد؟',
            'type': Number,
        },

        hours:{
            'name': 'تعداد ساعت',
            'mess': 'هر بن تخفیف چند ساعت تاریخ مصرف دارد؟',
            'type': Number,
        },

        consumption:{
            'name': 'دفعات مصرف بن',
            'mess': 'هر بن تخفیف چند بار باید مصرف شود.',
            'type': Number,
        },

        status: {
            'name': 'وضعیت',
            'mess': 'لطفا وضعیت بن ساز را مشخص کنید.',
            'items' : [
                {'name': true, 'lable':'فعال'},
                {'name': false, 'lable':'غیر فعال'},
            ]
        },
    }
}