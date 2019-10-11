import axios from 'axios'
import { promisic } from './util'
import { getAccessToken } from './common'

// 标识是否正在刷新token值
window.isRefreshing = false

/* 被挂起的请求数组 */
let refreshSubscribers = []

/* push所有请求到数组中 */
function subscribeTokenRefresh (cb) {
  refreshSubscribers.push(cb)
}

/* 刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据） */
function onRefreshed (token) {
  if (refreshSubscribers.length > 0) {
    refreshSubscribers.map(cb => cb(token))
  }
  refreshSubscribers = []
}

const instance = axios.create({
  baseURL: ''
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 若token处于刷新状态
    if (window.isRefreshing) {
      /* 把请求(token)=>{....}都push到一个数组中 */
      let retry = new Promise((resolve, reject) => {
        /* (token) => {...}这个函数就是回调函数 */
        subscribeTokenRefresh((token) => {
          config.headers.Authorization = 'bearer ' + token
          /* 将请求挂起 */
          resolve(config)
        })
      })
      return retry
    }
    let accessToken = getAccessToken()
    onRefreshed(accessToken)
    config.headers.Authorization = `bearer ${accessToken}`
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器
// instance.interceptors.response.use(
// )

class Http {
  static request ({ url, data = {}, method = 'GET' }) {
    return promisic(instance)({ url, data, method })
    // return new Promise((resolve, reject) => {
    //   instance({
    //     url,
    //     method,
    //     data,
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //     }
    //   }).then(res => {
    //     resolve(res)
    //   }).catch(err => {
    //     reject(err)
    //   })
    // })
  }
}

export {
  Http
}
