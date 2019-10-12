import axios from 'axios'
import { promisic } from './util'
import { Token } from './token'

const instance = axios.create({
  baseURL: ''
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    let accessToken = Token.getAccessToken()
    if (!accessToken) {
      Token.refreshToken()
    } else {
      config.headers.Authorization = `bearer ${accessToken}`
    }
    // token刷新中 请求挂起
    if (Token.isRefreshing) {
      let retry = new Promise((resolve, reject) => {
        /* (token) => {...}这个函数就是回调函数 */
        Token.subscribeTokenRefresh((token) => {
          config.headers.Authorization = 'bearer ' + token
          /* 将请求挂起 */
          resolve(config)
        })
      })
      return retry
    }
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
