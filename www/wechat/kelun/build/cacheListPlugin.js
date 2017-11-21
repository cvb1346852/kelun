var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var PackCacheList = require('./zipPack');
var config = require('../config')
var options = config.build.cacheListConfig;
var assetsRoot = config.build.assetsRoot;

function FileListPlugin() {
}

FileListPlugin.prototype.apply = function (compiler) {
    // 创建一个头部字符串：
    var filelist = {
        hostRegular: options.hostRegular.toString(),
        folderName: options.folderName,
        cacheList: [],
        always: [],
    };

    compiler.plugin('emit', function (compilation, callback) {
        var always = options.always || [];
        for (var filename in compilation.assets) {
            var isAlways = false;
            if (compilation.assets.hasOwnProperty(filename)) {
                always.forEach((ele) => {
                    var reg = new RegExp(ele);
                    if (reg.test(filename)) {
                        isAlways = true;
                    }
                });

                // // md5
                // var hash = crypto.createHash('md5');
                // if (isAlways) {
                //     hash.update(fs.readFileSync(path.resolve(assetsRoot, filename)));
                // } else {
                //     hash.update(compilation.assets[filename].source());
                // }

                filelist[isAlways ? 'always' : 'cacheList'].push({
                    path: `${options.pathname}/${filename}`,
                    realPath: path.resolve(assetsRoot, filename),
                });
            }
        }

        callback();
    });
    compiler.plugin('done', function (compilation) {
        setTimeout(function () {
            for (var file of filelist['always']) {
                var hash = crypto.createHash('md5');
                hash.update(fs.readFileSync(file.realPath));
                file.md5 = hash.digest('hex').substring(0, 7);
                delete file.realPath;
            }
            for (var file of filelist['cacheList']) {
                var hash = crypto.createHash('md5');
                hash.update(fs.readFileSync(file.realPath));
                file.md5 = hash.digest('hex').substring(0, 7);
                delete file.realPath;
            }

            fs.open(path.resolve(assetsRoot, 'cachelist.json'), 'w', function (e, fd) {
                if (e) throw e;
                // manifest = fis.util.realpath(t.filePath + t.mfArgs.path);
                // 写入文件
                fs.writeFile(fd, JSON.stringify(filelist, null, 4), function (err) {

                    if (err) {
                        return console.log(err);
                    }
                    console.log('generate cacheList file done');

                    if (options.zippack) {
                        PackCacheList.init();
                    }
                });
            });
        }, 1000);
    });
};

module.exports = FileListPlugin;
