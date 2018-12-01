import axios from 'axios'
import { OSS_BASE_URL } from '@/constants'

/**
 * 从给定的 uri 下载文件，文件名为 name
 *
 * @param {String} uri file uri
 * @param {String} name file name
 */
export function downloadURI (uri, name) {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Axios Get 请求参数序列化器 paramsSerializer
 * 使用 Get 请求接口时，发送数组 colorIds, 默认会解析成 colorIds[]=1&colorIds[]=2
 * 本序列化器会解析成 colorIds=1&colorIds=2
 * https://github.com/axios/axios/issues/604
 *
 * @param {Object} params
 */
export function transformRequestOptions (params) {
  let options = ''
  for (const key in params) {
    if (typeof params[key] !== 'object' && params[key]) {
      options += `${key}=${params[key]}&`
    } else if (typeof params[key] === 'object' && params[key].length) {
      params[key].forEach(el => {
        options += `${key}=${el}&`
      })
    }
  }
  return options ? options.slice(0, -1) : options
}

/**
 * 返回 OSS 全路径
 *
 * @param {String} key oss file key
 */
export function ossFullURL (key) {
  return `${OSS_BASE_URL}/${key}`
}

/**
 * 确保从远端加载，url 后加随机字符串
 *
 * @param {String} url request URL
 */
export function loadFromRemote (url) {
  if (url.includes('?')) {
    url += '&'
  } else {
    url += '?'
  }

  return url + Math.random()
}

export function applyToken (token) {
  axios.defaults.headers.common['Authorization'] = token
}

const CACHE_DICTIONARY = {}
/**
 * 获取字典数据，并维护一个缓存列表
 * FIXME 并发调用字典时，没有正确应用缓存，启用排队机制，同一时间只能同时获取不同类型的字典
 *
 * @param {string} type 字典类型
 * @param {boolean} disableCache 禁用缓存
 */
export function dictionary (type, disableCache = false) {
  if (!disableCache) {
    if (CACHE_DICTIONARY[type]) {
      return new Promise((resolve, reject) => {
        resolve({
          data: CACHE_DICTIONARY[type]
        })
      })
    }
  }

  const promise = axios.get(`/designer_api/dictionaries/${type}`)
  promise.then(response => {
    // 放入字典缓存
    CACHE_DICTIONARY[type] = response.data
  })
  return promise
}

const COLOR_LETTERS = '0123456789ABCDEF'
export function randomColor () {
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += COLOR_LETTERS[Math.floor(Math.random() * 16)]
  }
  return color
}

/**
 * 返回不重复的产品集合
 *
 * @param {Object Array} canvasObjects 画布对象列表
 */
export function uniqueProductSet (canvasObjects) {
  if (!canvasObjects) return []

  const array = []
  canvasObjects.forEach(object => {
    if (!object.meta) return
    // 过滤重复产品
    if (array.some(e => e.id === object.meta.id)) return
    array.push(object.meta)
  })
  return array
}
