const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const cheerio = require('cheerio');
const fs = require('fs');

const URL = require('./url.js');
// const URL = encodeURI(URL.SPIDER_URL);

superagent
    .get(URL)
    // .query({
    //     'wd': URL.KEY_WORD
    // })
    .end(function(err, res) {
        if (err) {
            console.log(err);
            return false;
        }
        let $ = cheerio.load(res.text);
        let str = '';
        $('.RichContent-inner').each(function(index, item) {
            if (index < 10) {
                str += `${index}:${$(item).text()}\r\nhref:${$(item).attr('href')}\r\n`;
            }
            // superagent
            //     .get($(item).attr('href'))
            //     .charset('utf-8')
            //     .end(function(err_d, res_d) {
            //         if (err_d) {
            //             console.log(err_d);
            //             return false;
            //         }
            //         let $_d = cheerio.load(res_d.text);
            //         fs.writeFile(`baidu${index}.txt`, $_d('body').html(), function(err) {
            //             if (err) {
            //                 console.log(err);
            //             } else {
            //                 console.log(`ok${index}.`)
            //             }
            //         });
            //     });
        });
        fs.writeFile('result_list.txt', str, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('ok.')
            }
        });
    });