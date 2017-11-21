// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '',
        // vue-router mode
        mode: 'hash',
        // cacheListConfig
        cacheListConfig: {
            // cacheList.json会保存项目目录下
            // 各发布环境的host的正则表达式
            hostRegular: /^test\.truckmanager\.g7s\.chinawayltd\.com$/,
            // 发布环境的pathname
            pathname: '/pathname',
            // 压缩包的文件名
            folderName: 'folderName',
            // 入口页
            always: ['index.html'],
            // 是否自动生成压缩包
            zippack: true,
        },
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8098,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/wechat.php': {
                target: 'http://172.22.122.34:80',
                changeOrigin: true,
                pathRewrite: {}
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
