const config = require('../config')
// 专为 webpack merge
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')



const devWebpackConfig = merge(baseWebpackConfig, {
  devtool: config.dev.devtool,
  devServer: {
    // 当使用内联模式(inline mode)时，在开发工具(DevTools)的控制台(console)将显示消息，如：在重新加载之前，
    // 在一个错误之前，或者模块热替换(Hot Module Replacement)启用时。这可能显得很繁琐。
    clientLogLevel: 'warning',
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。设置 true
    historyApiFallback: true,
    // 启用 webpack 的模块热替换特性
    hot: true,
    // 一切服务都启用 gzip 压缩
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    // 启用打开后，开发服务器将打开浏览器
    open: true,
    // 当存在编译器错误或警告时，在浏览器中显示全屏覆盖。
    // 默认情况下禁用。
    // 如果只想显示编译器错误
    // 只显示警告 与 错误
    overlay: {
      warnings: true,
      errors: true
    },
    // 假设服务器运行在 http://localhost:8080 并且 output.filename 被设置为 bundle.js
    // 。默认 publicPath 是 "/"，所以你的包(bundle)可以通过 http://localhost:8080/bundle.js 访问
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。
    // 这也意味着来自 webpack 的错误或警告在控制台不可见
    quiet: true, // necessary for FriendlyErrorsPlugin
    // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，
    // 当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询
    watchOptions: {
      poll: config.dev.poll
    }
  }
})