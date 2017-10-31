const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const cheerio = require('cheerio');

const CONFIG = require('./config.js');
const PLUGIN = require('./plugin.js');

CONFIG.SPIDER_URL.forEach(function(url, idx) {
    superagent
        .get(url)
        // .query({
        //     'wd': URL.KEY_WORD
        // })
        .end(function(err, res) {
            if (err) {
                console.log(err);
                return false;
            }
            let $ = cheerio.load(res.text, { decodeEntities: false });  // decodeEntities:false是防止出现中文编码问题
            findImportantText($);
        });
});

function findImportantText($) {
    let len = 0;
    let str = '';
    let testTagReg = /^(div|section|span|p)$/i;
    // 遍历所有标签
    $('*').each((index, item) => {
        if (testTagReg.test($(item)[0].tagName.toLowerCase())) {
            // 只要内容里除了<br>外没有别的标签，则认为是叶子节点
            let flag = false;
            $(item).children().each(function(index, item) {
                if (item.name.toLowerCase() != 'br') {
                    flag = true;
                }
            });
            // $(item).parent()
            //如果是叶子节点，进行内容分析
            if (!flag) {
                let str_inner = $(item).html().replace(/(\<br\>)/g, '\r\n').replace(/\&nbsp;/g, ' ');
                if (
                    str_inner.length >= CONFIG.ARTICLE_LENGTH &&
                    str_inner.match(new RegExp(CONFIG.KEY_WORDS, 'g')) &&
                    str_inner.match(new RegExp(CONFIG.KEY_WORDS, 'g')).length >= CONFIG.KEY_WORDS_TIME
                ) {
                    len++;
                    str += `${len}:${$(item)[0].tagName.toLowerCase()}\r\n${str_inner}\r\n`;
                }
            }
        }
    });

    if(!PLUGIN.checkFileExist(`${CONFIG.DIRECTORY_NAME}/`)) {   // 先判断目录是否存在，不存在则创建
        PLUGIN.mkdirSync(CONFIG.DIRECTORY_NAME);
    }

    let dirList = PLUGIN.readdirSync(`./${CONFIG.DIRECTORY_NAME}`);     // 把结果存为文件，名字重复在后面增加'---\d'
    if (dirList.includes(`${$('title').text()}.txt`)) {
        let regRes = 0;
        dirList.forEach((item, idx) => {
            if (new RegExp(`${$('title').text()}---\\d.txt`, 'i').test(item)) {
                regRes++;
            }
        });
        PLUGIN.writeFile(`${CONFIG.DIRECTORY_NAME}/${$('title').text()}---${++regRes}.txt`, str);
    } else {
        PLUGIN.writeFile(`${CONFIG.DIRECTORY_NAME}/${$('title').text()}.txt`, str);
    }
}