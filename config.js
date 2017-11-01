/**
 * 配置项
 * @key {Array} SPIDER_URL 网址列表
 * @key {String} DIRECTORY_NAME 目录名
 * @key {String} KEY_WORDS 关键字
 * @key {Number} KEY_WORDS_TIME 关键字出现次数
 * @key {Number} ARTICLE_LENGTH 文章长度
 */
const configs = {
    SPIDER_URL: [
        // 'https://www.zhihu.com/question/20443516',
        'http://news.ifeng.com/a/20150219/43201470_0.shtml',
    ],
    DIRECTORY_NAME: '曾国藩文章',
    KEY_WORDS: '曾国藩',
    KEY_WORDS_TIME: 3,
    ARTICLE_LENGTH: 20,
}

module.exports = configs