import axios from 'axios'
import { promisic } from './util'
import { Token } from './token'
import qs from 'qs'

let instance
let waitReq = []

const passUrl = [
  '/api/login.php',
  '/api/reToken.php'
]

const defaultConfig = {
  baseURL: '',
  headers: {
    'Content-Type': 'application/json' // application/x-www-form-urlencoded
  }
}

const merge = function (target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    let source = arguments[i]
    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        let value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }

  return target
}

const initInstance = function (options) {
  console.log(merge(defaultConfig, options))
  instance = axios.create(merge(defaultConfig, options))

  /**
   * 请求拦截
   */
  instance.interceptors.request.use(
    async config => {
      // 无需拦截的请求
      if (passUrl.includes(config.url)) {
        return config
      }
      // 若正在刷新token,则挂起当前请求
      if (Token.refreshing) {
        return hangReq(config)
      }
      const accessToken = await Token.getAccessToken()
      config.headers.Authorization = `bearer ${accessToken}`
      // 重新发起挂起的请求
      reReq(accessToken)
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )
}

/**
 * 挂起请求
 */
const hangReq = function (c) {
  return new Promise((resolve, reject) => {
    waitReq.push((token) => {
      c.headers.Authorization = 'bearer ' + token
      resolve(c)
    })
  })
}

/**
 * 重新请求
 */
const reReq = function (token) {
  if (waitReq.length > 0) {
    console.log('restart')
    waitReq.map(cb => cb(token))
    waitReq = []
  }
}

class Http {
  static request (params, options) {
    if (params.headers && params.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      params.data = qs.stringify(params.data)
    }
    if (!instance) {
      initInstance(options)
    }
    return promisic(instance)(params)
  }

  static get (url, { params = {} }, options) {
    return this.request({ url, params, method: 'GET' }, options)
  }

  static post (url, { data = {} }, options) {
    return this.request({ url, data, method: 'POST' }, options)
  }
}

export {
  Http
}
