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
            let $ = cheerio.load(res.text, { decodeEntities: false }); // decodeEntities:false是防止出现中文编码问题
            findImportantText($);
        });
});

function findImportantText($) {
    let len = 0;
    let str = '';
    let testTagReg = /(div|section|span|p)/i;
    let temp_arr = []; // 存放已分析过的节点
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
            let index = 1;
            //如果是叶子节点，而且父节点未被分析过，进行内容分析
            if (!flag && !temp_arr.includes($(item).parent()[0]) && /div/.test($(item).parent()[0].tagName.toLowerCase())) {
                temp_arr.push($(item).parent()[0]);
                str += index++ + checkParent($, $(item).parent()) + '\r\n';
            }
        }
    });

    if (!PLUGIN.checkFileExist(`${CONFIG.DIRECTORY_NAME}/`)) { // 先判断目录是否存在，不存在则创建
        PLUGIN.mkdirSync(CONFIG.DIRECTORY_NAME);
    }

    let dirList = PLUGIN.readdirSync(`./${CONFIG.DIRECTORY_NAME}`), // 把结果存为文件，名字重复在后面增加'---\d'
        fileName = $('title').text().replace(/(\||\:|\*|\\|\/|\"|\<|\>|\?)/g,' ');
    if (dirList.includes(`${fileName}.txt`)) {
        let regRes = 0;
        dirList.forEach((item, idx) => {
            if (new RegExp(`${fileName}---\\d.txt`, 'i').test(item)) {
                regRes++;
            }
        });
        PLUGIN.writeFileSync(`${CONFIG.DIRECTORY_NAME}/${fileName}---${++regRes}.txt`, str);
    } else {
        PLUGIN.writeFileSync(`${CONFIG.DIRECTORY_NAME}/${fileName}.txt`, str);
    }
}

function checkParent($, $node) { // 判断节点是否符合
    let str_inner = $node.html()
        .replace(/\s/g, '')
        .replace(/\<\/?br\>/g, '\r\n')
        .replace(/\<\/(p|div)\>/g, '\r\n')
        .replace(/\<.*\>/g, '')
        // .replace(/\<\/.*\>/g, '')
        .replace(/\&nbsp;/g, ' ')
        .replace(/\&lt;/g, '<')
        .replace(/\&gt;/g, '>');
    if (
        str_inner.length >= CONFIG.ARTICLE_LENGTH &&
        str_inner.match(new RegExp(CONFIG.KEY_WORDS, 'g')) &&
        str_inner.match(new RegExp(CONFIG.KEY_WORDS, 'g')).length >= CONFIG.KEY_WORDS_TIME
        // true
    ) {
        return str_inner;
        // len++;
        // str += `${len}:${$(item)[0].tagName.toLowerCase()}\r\n${str_inner}\r\n`;
    }
    return '';
}