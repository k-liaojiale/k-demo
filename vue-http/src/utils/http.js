import axios from 'axios'
import { promisic } from './util'
import { Token } from './token'

const instance = axios.create({
  baseURL: ''
})

const passUrl = [
  '/token.php'
]

let waiting = []

/**
 * 请求拦截
 */
instance.interceptors.request.use(
  config => {
    // 无需拦截的请求
    if (passUrl.includes(config.url)) {
      return config
    }
    // 是否正在刷新token
    if (Token.refreshing) {
      return hang(config)
    }
    // 获取token
    let accessToken = Token.getAccessToken()
    if (!accessToken) {
      // token不存在则请求刷新
      refreshToken()
      return hang(config)
    }
    config.headers.Authorization = `bearer ${accessToken}`
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

/**
 * 挂起请求
 */
const hang = function (c) {
  return new Promise((resolve, reject) => {
    waiting.push((token) => {
      c.headers.Authorization = 'bearer ' + token
      /* 将请求挂起 */
      resolve(c)
    })
  })
}

/**
 * 重新请求
 */
const restart = function () {
  console.log('restart')
  if (waiting.length > 0) {
    waiting.map(cb => cb(Token.getAccessToken()))
    waiting = []
  }
}

const refreshToken = async function () {
  await Token.refresh()
  restart()
}

class Http {
  static request ({ url, data = {}, method = 'GET' }) {
    return promisic(instance)({ url, data, method })
  }
}

export {
  Http
}
