const WebpackAliyunOssPlugin = require('webpack-aliyun-oss-plugin')
const env = process.env

module.exports = {
  baseUrl: env.BASE_URL,
  configureWebpack () {
    const plugins = []

    // 存在 BASE_URL 环境变量，上传静态资源到 Aliyun OSS
    if (env.BASE_URL) {
      plugins.push(new WebpackAliyunOssPlugin({
        ak: env.OSS_AK,
        sk: env.OSS_SK,
        bucket: env.OSS_BUCKET,
        region: env.OSS_REGION,
        filter (asset) {
          return !/\.html$/.test(asset)
        }
      }))
    }

    return {
      plugins
    }
  },
  devServer: {
    disableHostCheck: true
  }
}
