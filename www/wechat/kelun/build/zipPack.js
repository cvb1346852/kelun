/**
 * Created by denglei on 17/6/7.
 */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
var config = require('../config');
var options = config.build.cacheListConfig;
var assetsRoot = config.build.assetsRoot;

/*根据缓存列表打包的工作*/
var PackCacheList = {
    beforeZipSize: 0,
    afterZipSize: 0,
    copyNum: 0,   //有多少个文件已经copy完了
    ifCopyOver: false, //是否所有文件copy完了
    cacheNum: 0,  //缓存文件的数量
    packEnd: false, //是否打包压缩完了
    init: function () {
        var t = this,
            timer = null;

        t.copyIntoNewFolder();

        // 全部复制完了才执行打包和压缩的操作
        timer = setInterval(function () {
            if (t.copyNum >= t.cacheNum) {
                clearInterval(timer);
                t.packZip(function () {
                    t.getFileSize();
                    t.deleteCopyFolder();
                });
            }
        }, 100);
    },
    copyIntoNewFolder: function () {
        var t = this;
        // t.mfArgs = fis.config.get('cacheList');
        // t.filePath = t.mfArgs.filesPath;
        try {
            // copy cacheList files
            t.cacheList = JSON.parse(fs.readFileSync(path.resolve(assetsRoot, 'cachelist.json'), 'utf8'))['cacheList'];

            // 一共有多少缓存文件
            t.cacheNum = t.cacheList.length;
            for (var i = 0, len = t.cacheList.length; i < len; i++) {
                var src = path.resolve(assetsRoot, `${t.cacheList[i].path.replace(options.pathname, '.')}`);
                var dst = `./zipContent/${t.cacheList[i].path.replace(options.pathname, options.folderName)}`;
                t.copy(src, dst);
            }

            // // copy always files
            // t.alwaysList = JSON.parse(fs.readFileSync(fis.util.realpath(t.filePath + t.mfArgs.path), 'utf8'))['always'];
            // // 一共有多少缓存文件
            // t.alwaysNum = t.alwaysList.length;
            // for (var i = 0, len = t.alwaysList.length; i < len; i++) {
            //     var src = t.alwaysList[i].replace('/mobile', '../mobile');
            //     var dst = t.alwaysList[i].replace('/mobile', '../zipContent/mobile');
            //     t.copy(src, dst);
            //     //var temp = t.alwaysList[i]
            // }
        } catch (e) {
            console.log('似乎是读取缓存列表文件出问题了');
            console.log(e);
        }
    },
    packZip: function (callback) {
        var t = this;
        t.pack(callback);
    },
    deleteCopyFolder: function () {
        var deleteFolderRecursive = function (path) {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function (file, index) {
                    var curPath = path + '/' + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };
        deleteFolderRecursive('./zipContent');
        console.log('删除缓存目录成功');
    },
    mkdirSync: function (url, mode, cb) {
        var arr = url.split('/');
        mode = mode || 0o755;
        cb = cb || function () {
        };
        if (arr[0] === '.') {//处理 ./aaa
            arr.shift();
        }
        if (arr[0] == '..') {//处理 ../ddd/d
            arr.splice(0, 2, arr[0] + '/' + arr[1])
        }

        function inner(cur) {
            if (!fs.existsSync(cur)) {//不存在就创建一个
                fs.mkdirSync(cur, mode)
            }
            if (arr.length) {
                inner(cur + '/' + arr.shift());
            } else {
                cb();
            }
        }

        arr.length && inner(arr.shift());
    },
    copy: function (src, dst) {
        var t = this;
        var r = /^(.*)\/.*$/;
        var temp = dst;
        //console.log(dst.replace(r, "$1"));
        t.mkdirSync(temp.replace(r, "$1"), 0, function () {
            var readable = fs.createReadStream(src);
            var writeable = fs.createWriteStream(dst);
            readable.pipe(writeable);
            writeable.on('close', function () {
                t.copyNum += 1;
            });
        });
    },
    pack: function (callback) {
        var t = this;
        console.log('pack start.................');
        t.mkdirSync('./mobileZip', 0, function () {
        });
        var files = fs.readdirSync('./mobileZip');
        for (var i = 0, len = files.length; i < len; i++) {
            if (/^mobile_.*\.zip$/.test(files[i])) {
                fs.unlinkSync('./mobileZip/' + files[i]);
            }
        }
        var output = fs.createWriteStream('./mobileZip/temp.zip');
        var archive = archiver('zip');
        archive.on('error', function (err) {
            throw err;
        });

        archive.pipe(output);
        output.on('close', function () {
            t.packEnd = true;
            console.log('pack end');
            callback && callback.call(t);
        });
        archive.directory('./zipContent/', '');
        archive.finalize();
    },
    getFileSize: function () {
        console.log('get the size of the folder......................');
        var t = this;
        var filesList = t.geFileList('./zipContent');
        for (var i = 0, len = filesList.length; i < len; i++) {
            t.beforeZipSize += filesList[i].size;
        }
        console.log('文件未压缩前的总大小为' + t.beforeZipSize);
        try {
            var zipSize = fs.statSync('./mobileZip/temp.zip');
            t.afterZipSize = zipSize.size;
            console.log('文件压缩后的大小为' + t.afterZipSize);
        } catch (e) {
            console.log('请检查zip文件是否存在');
        }
        fs.rename('./mobileZip/temp.zip', `./mobileZip/${options.folderName}_${t.beforeZipSize}_${t.afterZipSize}.zip`, function () {
        });
        console.log('重命名zip包完成');

    },
    geFileList: function (path) {
        var t = this;
        var filesList = [];
        t.readFile(path, filesList);
        return filesList;
    },

    //遍历读取文件
    readFile: function (path, filesList) {
        var t = this;
        var files = fs.readdirSync(path);//需要用到同步读取
        files.forEach(walk);

        function walk(file) {
            states = fs.statSync(path + '/' + file);
            if (states.isDirectory()) {
                t.readFile(path + '/' + file, filesList);
            }
            else {
                //创建一个对象保存信息
                var obj = new Object();
                obj.size = states.size;//文件大小，以字节为单位
                obj.name = file;//文件名
                obj.path = path + '/' + file; //文件绝对路径
                filesList.push(obj);
            }
        }
    }
};
if(process.argv.slice(2).indexOf("--zip") > -1) {
    PackCacheList.init();
}
module.exports = PackCacheList;
