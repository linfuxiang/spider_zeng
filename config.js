/**
 * 配置项
 * @key {Array} SPIDER_URL 网址列表，下面的是我自己添加的，不用的整行删除，需要的按照一样的格式添加一行就行了，记得前后加上单引号''
 * @key {String} DIRECTORY_NAME 保存爬虫结果的文件夹名字
 * @key {String} KEY_WORDS 关键字
 * @key {Number} KEY_WORDS_TIME 关键字出现次数，关键字出现超过这个次数才会被记录下来
 * @key {Number} ARTICLE_LENGTH 每篇文章长度，超过这个长度才会被记录下来
 */
const configs = {
    SPIDER_URL: [
        'http://news.ifeng.com/a/20150219/43201470_0.shtml',
        'http://news.ifeng.com/a/20150219/43201470_1.shtml',
        'http://cul.qq.com/a/20160129/024798.htm',
        'http://www.sohu.com/a/201436752_623197',
    ],
    DIRECTORY_NAME: '曾国藩文章',
    KEY_WORDS: '曾国藩',
    KEY_WORDS_TIME: 5,
    ARTICLE_LENGTH: 20,
}

module.exports = configs