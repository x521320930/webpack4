/**
 * @author  x521320930@gmail.com
 * @version 1.0 | 2018-12-27
 * @describe  // Axios 封装
 * @example
 */
import Axios from 'axios'
const qs = require('qs')
// // TODO 设置超时时间 5分钟
// Axios.defaults.timeout = 300000
// 结束
Axios.defaults.headers = {
// 'Accept-Encoding': 'gzip, deflate, br',
// 'Accept-Language': 'zh-CN,zh;q=0.9',
// 'Cache-Control': 'no-cache',
// 'Connection': 'keep-alive',
// 'Content-Length': 34,
  'Content-Type': 'application/json;charset=UTF-8'
}
// // 是否是本地联调
// if (process.env.NODE_ENV == 'development') {
//   Axios.defaults.headers['Access-Control-Allow-Origin'] = 'http://10.0.4.237:9528'
//   Axios.defaults.withCredentials = true
//   Axios.defaults.crossDomain = true
// }
//   // 'Access-Control-Allow-Origin': '*',
//   // 'Access-Control-Allow-Credentials': true,
//   // 'content-Type': 'application/json;charset=UTF-8'

// `transformRequest` 允许在向服务器发送前，修改请求数据
// 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
// 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
Axios.defaults.transformRequest = [function (body, headers) {
  const data = body
  const ct = headers['Content-Type']
  switch (ct) {
    case 'application/json;charset=UTF-8' :
      return JSON.stringify(data)
    case 'multipart/form-data;charset=utf-8' :
      return data
    default : {
      return qs.stringify(data)
    }
  }
}]
// 允许携带cookie
// Axios.defaults.withCredentials = true
// TODO http code 校验
Axios.defaults.validateStatus = function (status) {
  return status
}
// 请求拦截 添加TOKen
Axios.interceptors.request.use(config => {
  return config
}, error => {
  Promise.reject(error)
})

// TODO 响应拦截器
Axios.interceptors.response.use(response => {
  const starts = response.status
  if (starts === 200) {
    return Promise.resolve(response.data)
  } else {
    return Promise.reject(response.data)
  }
}, error => {
  return Promise.reject(error)
})

/**
 * @description 统一 GET 请求
 * @param url
 * @param params --> GET 请求参数（***?name=walid&age=25）
 */
function get (url, params, contentType = 'application/json;charset=UTF-8') {
  // 重置 Content-Type 类型头
  Axios.defaults.headers['Content-Type'] = contentType
  return new Promise((resolve, reject) => {
    Axios.get(url, { params: params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 统一 POST 请求
 * @param url
 * @param body --> POST 请求 data
 */
function post (url, body, contentType = 'application/json;charset=UTF-8') {
  return new Promise((resolve, reject) => {
    Axios.defaults.headers['Content-Type'] = contentType
    Axios.post(url, body)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 统一 PUT 请求
 * @param url
 * @param body --> PUT 请求 data
 */
function put (url, body) {
  return new Promise((resolve, reject) => {
    Axios.put(url, body)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
/**
 * @description 统一 PUT 请求
 * @param url
 * @param body --> PUT 请求 data
 */
function all (body) {
  return new Promise((resolve, reject) => {
    Axios.all(body).then(Axios.spread(function () {
      resolve([...arguments])
    })).catch(r => {
      reject(r)
    })
  })
}

export default {
  get, post, put, all
}
