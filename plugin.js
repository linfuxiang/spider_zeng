const fs = require('fs');

let plugins = {
    /**
     * 查询文件是否存在
     * @param  {String} fileName  文件名
     * @param  {String} directory 目录(默认当前目录)
     * @return {Boolean}
     */
    checkFileExist: function(fileName, directory = './') {
        let result = false;
        try {
            result = fs.existsSync(directory + fileName);
        } catch (err) {
            console.log(err);
            result = false;
        }
        return result;
    },
    /**
     * 把内容写入文件(异步)
     * @param  {String} fileName  文件名
     * @param  {String} text 	  内容
     */
    writeFile: function(fileName, text) {
        fs.writeFile(fileName, text, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('ok.')
            }
        });
    },
    /**
     * 把内容写入文件(同步)
     * @param  {String} fileName  文件名
     * @param  {String} text 	  内容
     */
    writeFileSync: function(fileName, text) {
        try {
            return fs.writeFileSync(fileName, text);
        } catch (err) {
            console.log(err);
            return false;
        }

    },

}

module.exports = plugins