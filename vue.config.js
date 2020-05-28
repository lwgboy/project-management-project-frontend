'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '后台管理系统模板' // 页面title
const port = 80 // 开发时的端口号

// 配置项 https://cli.vuejs.org/config/
module.exports = {
  // 如果计划在子路径（例如github页面）下部署站点，则需要设置publicpath。如果计划将站点部署到https://foo.github.io/bar/，则publicpath应设置为“/bar/”。在大多数情况下，请使用“/”！！！！详细信息：https://cli.vuejs.org/config/#publicpath
  publicPath: '/',
  outputDir: './dist/' + process.env.VUE_APP_TITLE,
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  configureWebpack: {
    // 在webpack的name字段中提供应用程序的标题，以便可以在index.html中访问该应用程序以插入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 关闭 webpack 的性能提示
    performance: {
      hints: false
    }
  },
  chainWebpack (config) {
    // 移除 preload 插件
    config.plugins.delete('preload')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    config
      .entry('main')
      .add('babel-polyfill')
      .end()

    // 设置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 设置 preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-module-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // runtime必须与runtimechunk名称相同。默认值为“runtime”`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 仅打包最初依赖的第三方
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementui拆分为一个包
                  priority: 20, // 重量必须大于libs和app，否则将打包成libs或app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可以自定义规则
                  minChunks: 3, //  最小公共数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
