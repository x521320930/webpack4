module.exports = {
  dev: {
    // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
    host: '127.0.0.1',
    // 指定要监听请求的端口号
    port: '8989',
    assetsPublicPath: '/',
    // cheap-module-eval-source-map - 类似 cheap-eval-source-map，并且，
    // 在这种情况下，源自 loader 的 source map 会得到更好的处理结果。
    // 然而，loader source map 会被简化为每行一个映射(mapping)。
    devtool: 'cheap-module-eval-source-map',
    // 代理
    proxyTable: {
    },
    poll: false
  },
  build: {
    // 这仍然会暴露反编译后的文件名和结构，但它不会暴露原始代码。
    devtool: 'nosources-source-map'
  }
}