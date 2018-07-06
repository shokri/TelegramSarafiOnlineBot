var token = '525130290:AAF-LLjAuHgjHRrj6al2H0VeBZc0zhaBzyA',
    Telegraf = require('telegraf'),
    Extra = require('telegraf/extra'),
    Markup = require('telegraf/markup'),
    bot = new Telegraf(token),
    axios = require('axios');

var retail = {
    retail_sekeb: 'بهار آزادی',
    retail_sekee: 'سکه امامی',
    retail_nim: 'نیم سکه',
    retail_rob: 'ربع سکه',
    retail_gerami: 'سکه گرمی'
};

var gold = {
    gold_futures : 'مثقال طلا',
    geram18 : 'گرم طلای 18',
    geram24 : 'گرم طلای 24',
    gold_740k : 'گرم 18 عیار (740)'
};

var sana = [
    'usd',
    'eur',
    'aed',
    'gbp',
    'chf',
    'sek',
    'jpy',
    'cad',
    'try',
    'rub',
    'iqd',
    'aud',
    'cny',
    'krw',
    'inr',
    'nok'
];

function flag(f) {
    switch(f) {
        case 'usd':
            return '🇺🇸         دلار              ';
        case 'eur':
            return '🇪🇺         یورو              ';
        case 'aed':
            return '🇦🇪         درهم               ';
        case 'gbp':
            return '🇬🇧         پوند              ';
        case 'chf':
            return '🇨🇭         فرانک سوئیس    ';
        case 'sek':
            return '🇸🇪         کرون سوئد         ';
        case 'nok':
            return '🇳🇴         کرون نروژ          ';
        case 'jpy':
            return '🇯🇵         صد ین ژاپن        ';
        case 'cad':
            return '🇨🇦         دلار کانادا           ';
        case 'try':
            return '🇹🇷         لیر ترکیه          ';
        case 'cny':
            return '🇨🇳         یووان چین           ';
        case 'inr':
            return '🇮🇳         روپیه هند           ';
        case 'rub':
            return '🇷🇺         روبل روسیه         ';
        case 'aud':
            return '🇦🇺         دلار استرالیا        ';
        case 'iqd':
            return '🇮🇶         صد دینار عراق              ';
        case 'krw':
            return '🇰🇷         هزار وون کره              ';
        default:
            return ' ';
    }
};

function t(dt) {
    switch(dt) {
        case 'low':
            return '🔻';
        case 'high':
            return '🔺';
        default:
            return ' ';
    }
};

var keyboard = Markup.inlineKeyboard([
    Markup.urlButton('لینک سایت ما', 'http://lambda.smart-auto.ir')
]);

bot.command('start', (ctx) => {
    
    ctx.reply('خوش آمدید 🎉 \n اطلاع از قیمت لحظه ای طلا, سکه و ارز از بازار ایران و جهان', Markup
        .inlineKeyboard([
            Markup.urlButton('سفارش ربات', 'http://lambda.smart-auto.ir')
        ])
        .keyboard([
            ['ارز سنا', 'طلا', 'سکه'],
            ['📈 افزایش آنی', '📉 کاهش آنی'],
            ['📞 سفارش ربات']
        ])
        .oneTime()
        .resize()
        .extra()
    )
});
 
//💱 💸 💷 💴 💶💲

bot.hears('سکه', (ctx) => {
    axios
        .get(`http://call.tgju.org/ajax.json`)
        .then(res => {
            var data   = res.data.current,
                txt = 'سکه/تکی           قیمت            تغییر                      زمان\n';

            for ( var k in retail ) {
                for (var key in data) {
                    if (k === key) {
                        txt += retail[k]+ '           '+ data[key].p+ '     '+ data[key].d+ ' ('+ data[key].dp+ '%)'+ t(data[key].dt)+ '        '+ data[key].t+ '\n';
                        break;
                    }
                }
            };
            return ctx.reply(txt);
        })
        .catch(err => console.log(err));
});

bot.hears('طلا', (ctx) => {
    axios
        .get(`http://call.tgju.org/ajax.json`)
        .then(res => {
            var data   = res.data.current,
                txt = 'طلا                 قیمت                       تغییر             زمان  💰\n';
                
            for ( var k in gold ) {
                for (var key in data) {
                    if (k === key) {
                        txt += gold[k]+ '     '+ data[key].p+ '     '+ data[key].d+ ' ('+ data[key].dp+ '%)'+ t(data[key].dt)+ '        '+ data[key].t+ '\n';
                        break;
                    }
                }
            };
            return ctx.reply(txt);
        })
        .catch(err => console.log(err));
});

bot.hears('ارز سنا', (ctx) => {
    axios
        .get(`http://call.tgju.org/ajax.json`)
        .then(res => {
            var data   = res.data.current,
                txt = 'ارز سنا                                 خرید               فروش        ⚖\n';

            sana.forEach( function(e, i) {
                for (var key in data) {
                    if ('sana_buy_'+e == key) {
                        txt += flag(e)+ '     '+ t(data[key].dt)+ data[key].p+ '        ';
                        break;
                    }
                }
                for (var key in data) {
                    if ('sana_sell_'+e == key) {
                        txt += t(data[key].dt)+ data[key].p+ '\n';
                        break;
                    }
                }
            });
            return ctx.reply(txt);
        })
        .catch(err => console.log(err));
});

bot.hears('📉 کاهش آنی', (ctx) => {
    axios
        .get(`http://call.tgju.org/ajax.json`)
        .then(res => {
            var tolerance_low   = res.data.tolerance_low,
                txt = 'کاهش آنی                             قیمت                 تغییر     📉\n';

            tolerance_low.forEach( function(e, i) {
                txt += '🔻'+ e.title+'           '+ e.p+'           ('+ e.dp+ '%)\n ';
            });
            return ctx.reply(txt);
        })
        .catch(err => console.log(err));
});

bot.hears('📈 افزایش آنی', (ctx) => {
    axios
        .get(`http://call.tgju.org/ajax.json`)
        .then(res => {
            var tolerance_high   = res.data.tolerance_high,
                txt = 'افزایش آنی                 قیمت               تغییر     📈\n';

            tolerance_high.forEach( function(e, i) {
                txt += '🔺'+ e.title+'               '+ e.p+'               ('+ e.dp+ '%)\n';
            });
            return ctx.reply(txt);
        })
        .catch(err => console.log(err));
});

bot.hears('📞 سفارش ربات', (ctx) => ctx.reply('سفارش ساخت ربات تلگرام\n @MohammadrezaShokri\n 📱09124453874\n', Extra.markup(keyboard)));

bot.startPolling();