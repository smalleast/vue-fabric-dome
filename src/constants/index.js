// 后台服务基础地址
export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL
// Aliyun OSS 服务基础地址
export const OSS_BASE_URL = process.env.VUE_APP_OSS_BASE_URL
// 云设计平台地址
export const DESIGN_CLOUD_URL = process.env.VUE_APP_DESIGN_CLOUD_URL
// 云设计平台登录地址
export const DESIGN_CLOUD_LOGIN_PATH = process.env.VUE_APP_DESIGN_CLOUD_LOGIN_PATH

// 默认产品属性
export const DEFAULT_PRODUCT_PROPERTY = '常规'
// 默认画布比例
export const DEFAULT_RATIO = 'A3_HORIZONTAL'
// 默认添加到画布中的单品尺寸
export const DEFAULT_CANVAS_OBJECT_SIZE = 400
// Element UI 全屏加载中选项
export const LOADING_OPTIONS = {
  lock: true,
  text: 'Loading',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.7)'
}

// 收藏类型
export const FAVORITE_TYPE = {
  PRODUCT: 1, // 产品
  BOARD: 5 // 拼图
}
