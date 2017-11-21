const path = require('path')
const fs = require('fs')
const routesPath = path.resolve(__dirname, '../src/router/routes.js')

module.exports = {
    plugins: [
        'vux-ui', 'progress-bar', 'duplicate-style',
        {
            name: 'less-theme',
            path: 'src/theme.less'
        },
        {
            name: 'js-parser',
            test: /router(\/|\\)index\.js/,
            fn: function (source) {
                this.addDependency(routesPath)
                let list = fs.readFileSync(routesPath, 'utf-8')

                source = source.replace('const routes = [];', list)
                return source
            }
        },
    ]
}
