const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const cheerio = require('cheerio');
const fs = require('fs');

const CONFIG = require('./config.js');
// const URL = encodeURI(URL.SPIDER_URL);

superagent
    .get(CONFIG.SPIDER_URL)
    // .query({
    //     'wd': URL.KEY_WORD
    // })
    .end(function(err, res) {
        if (err) {
            console.log(err);
            return false;
        }
        let $ = cheerio.load(res.text, { decodeEntities: false });
        findImportantText($);
        // text = $.replace(/\<br\>/g, () => '\r\n').replace(/[<em.*>|<span.*>|</em>|</span>]/, () => '');
        // $('.RichContent-inner').each(function(index, item) {
        //     if (index < 10) {
        //         str += `${index}:${$(item).text()}\r\nhref:${$(item).attr('href')}\r\n`;
        //     }
        //     // superagent
        //     //     .get($(item).attr('href'))
        //     //     .charset('utf-8')
        //     //     .end(function(err_d, res_d) {
        //     //         if (err_d) {
        //     //             console.log(err_d);
        //     //             return false;
        //     //         }
        //     //         let $_d = cheerio.load(res_d.text);
        //     //         fs.writeFile(`baidu${index}.txt`, $_d('body').html(), function(err) {
        //     //             if (err) {
        //     //                 console.log(err);
        //     //             } else {
        //     //                 console.log(`ok${index}.`)
        //     //             }
        //     //         });
        //     //     });
        // });
        // fs.writeFile('result_list.txt', res.text, function(err) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log('ok.')
        //     }
        // });
    });

function findImportantText($) {
    // console.log($('body'));
    // if($('meta[]'))
    let len = 0;
    let str = '';
    let testTagReg = /^(div|section|span|p)$/i;
    $('*').each((index, item) => {
        if (testTagReg.test($(item)[0].tagName.toLowerCase())) {
            let flag = false;
            $(item).children().each(function(index, item) {
                if (item.name.toLowerCase() != 'br') {
                    flag = true;
                }
            });

            // if($(str_inner).find('*').length>0) {
            // 	return ;
            // }
            // $(item).find('p').each((idx, itm) => {

            // });
            if (!flag) {
                let str_inner = $(item).html().replace(/\<br\>/g, '\r\n');
                if (str_inner.length > 20) {
                    len++;
                    str += `${len}:${$(item)[0].tagName.toLowerCase()}\r\n${str_inner}\r\n`;
                }

            }
        }
    });
    fs.writeFile('result_list.txt', str, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('ok.')
        }
    });
}