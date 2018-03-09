module.exports = {
    category:{
        modulename:'category',
        asoption : 'دسته بندی',
        //admin
        name:'🗂 '+'دسته بندی',
        back:'⤴️ برگش به دسته بندی مطالب',
        message:'لطفا دسته بندی که میخواهید این قابلیت در آن نمایش داده ود را انتخاب کنید.',
        maincategory: 'دسته اصلی',  //don't change it, it has been stored in categories collection
        categoryoptions: ['📝 ویرایش دسته های فعلی', '✏️ افزودن دسته'],
        
        backtoParent:'⤴️ برگشت به بالا',
        edit:{
            name:'لطفا نام جدید دسته بندی را ارسال کنید.',
            parent:'لطفا دسته بندی مادر را انتخاب کنید.',
            description:'لطفا توضیحات دسته بندی را انتخاب کنید.',
            order:'لطفا اولویت دسته بندی را با عدد مشخص کنید. ترتیب محصولات و دسته بندی ها هنگامی که لیست میشوند بر اساس این اعداد است.'
        },

        //query
        queryCategory        :'category',
        queryCategoryName       :'name',
        queryCategoryParent     :'parent',
        queryCategoryDescription:'description',
        queryOrder              :'order',
        queryDelete             :'del'
    },

    post :{
        modulename:'post',
        //admin
        name:'🔖 مطالب',
        back:'⤴️ برگشت به 🔖 مطالب',

        endupload:'اتمام آپلود',
        endAttach:'اتمام پیوست',

        edit:{
            newSCMess :'لطفا یک نام برای مطلب جدید انتخاب کنید.' + '\n' + 'توجه کنید که این نام در داخل منو ها نمایش داده میشود.',            
            name:'لطفا نام جدید مطلب را وارد کنید.',
            description:'توضیحات جدید را وارد کنید.',
            category:'لطفا دسته بندی مورد نظر را انتخاب کنید.',
            upload:'متناسب با نوع مطلب، فایلی که میخاهید آپلود شود را ارسال کنید.',
            attach:'اکنون هر نوع فایلی را که میخواهید به عنوان پیوست بعد از مطلب مورد نظر ارسال شود، برایم ارسال کنید.',
            order:'لطفا اولویت مطلب را با عدد مشخص کنید. ترتیب محصولات و دسته بندی ها هنگامی که لیست میشوند بر اساس این اعداد است.'        
        },

        postOptions: ['❌ حذف مطلب', '✏️ افزودن مطلب'],
        scErrors : [
            'نام دسته بندی ها  مطالب نباید مثل هم باشد.',
            'مطب دیگری با این نام قبلا ثبت شده است.',
            'دسته بندی دیگری با این نام قبلا ثبت شده است.'        
        ],

        //post types
        types:{
            text : {'icon':'📄', 'name':'text'},
            file : {'icon':'📎', 'name':'file'},
            video: {'icon':'📺', 'name':'video'},
            sound: {'icon':'🎧', 'name':'sound'},
            photo: {'icon':'🏞', 'name':'photo'},
            attached:' - 🃏(دارای فایل)',
            ticket:'ticket'
        },

        //post query
        queryPost           :'pst',
        queryPostText       :'format' + 'text',
        queryPostFile       :'format' + 'file',
        queryPostPhoto      :'format' + 'photo',
        queryPostSound      :'format' + 'sound',
        queryPostVideo      :'format' + 'video',
        queryPostName       :'name',
        queryPostCategory   :'category',
        queryPostDescription:'description',  
    },

    sendMessage:{
        modulename:'contacttousers',
        //admin
        name:'📨 ارسال پیام به کاربران', 
        back:'',
        sendboxSymbol:'ـ ' + '🗒 ',
        sendMessToUsersNewMess:'پیام جدید',
        sendMessToUsersDeleteAll:'حذف همه از لیست',
        sendMessToUsersTitle:'لطفا عنوان پیام را ارسال کنید.',
        sendMessToUsersEditMess:'متن جدید را ارسال کنید.',
        wrongtitle : 'این عنوان قبلا ثبت شده است، لطفا عنوان دیگری انتخواب کنید.',
        contactWadminMess:'لطفا پیام متنی خود را برای مدیر مجموعه ارسال کنید.',        

        //send message to users
        queryAdminSndMess:'messageToUsers',
        queryAdminSndMessAdded          :'✅ ',
        queryAdminSndMessRemoved        :'❌ ',
        queryAdminSndMessSend           :'post',
        queryAdminSndMessDel            :'delete',
        queryAdminSndMessEditTitle      :'editTitle',
        queryAdminSndMessEditMessage    :'editMessage',
    },

    inbox: {
        modulename:'ticket',
        //admin
        name:'📬 صندوق پیام ها', 
        back:'⤴️ برگشت به صندوق پیام ها',
        readSym: ['📪','📭'],
        inboxDeleteAll: 'حذف تمام پیام ها',
        settings : '⚙️' + ' - ' + 'تنظیمات',
        backsetting: '⤴️ برگشت به ' + '⚙️' + ' - ' + 'تنظیمات',

        //user
        lable:'📨 ارسال پیام',
        getmess :'لطفا پیغام خود را ارسال کنید.',

        query : {
            inbox : 'inbox',
            answer : 'ans',
            delete: 'delete'
        },

        mess : {
          answer : 'لطفا متن پاسخ را ارسال کنید، در پایان متن ارسال شده از طرف کاربر به پاسخ پیوست می شود.'  
        }
    },

    settings : {
        modulename:'settings',
        name : 'تنظیمات',
        back : '⤴️ برگشت به تنظیمات',
        btns : {
            firstmess : 'پیغام ابتدایی',
        },
        mess : {
            firstmess : 'لطفا متن پیام ابتدایی ربات را ارسال کنید.',
            shorttext : 'لطفا یک متن طولانی تر ارسال کنید.',
        }
    },

    search : {
        modulename:'search',
        name : 'جستجو',
        back : '⤴️ برگشت به جستجو',

        //user
        lable:'🔎 ' + 'جستجو',
        getmess :'لطفا کلمه مورد نظر خودتان را ارسال کنید تا نتیجه جستجو را دریافت کنید.',
        result:'result',
        notfound:'چیزی پیدا نشد، لطفا کلمه ی دیگری را امتحان کنید.'
    },
}