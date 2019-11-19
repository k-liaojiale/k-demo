import axios from 'axios'
import router from '../router'
import { promisic } from './util'
import { Token } from '@/model/token'

let instance
let waitReq = []

const excludeUrls = [
  '/test/*',
  '/api/login.php',
  '/api/refreshToken.php'
]

const defaultConfig = {
  baseURL: '/api',
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

const initAxios = function (options) {
  instance = axios.create(merge(defaultConfig, options))

  /**
   * 请求拦截
   */
  instance.interceptors.request.use(
    async config => {
      // 无需拦截的请求
      if (judge(config.url)) {
        console.log(config.url)
        return config
      }
      // 若正在刷新token,则挂起当前请求
      if (Token.refreshing) {
        return hangReq(config)
      }
      const accessToken = await Token.getAccessToken()
      // token值获取失败
      if (!accessToken) {
        router.replace({
          path: '/login'
        })
        return hangReq(config)
      }
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

const judge = function (url) {
  if (url.indexOf('?') !== -1) {
    url = url.split('?')[0]
  }
  for (let i in excludeUrls) {
    if (excludeUrls[i].indexOf('*') !== -1) {
      let expUrl = excludeUrls[i].slice(0, excludeUrls[i].indexOf('*') - 1)
      let regExp = new RegExp('^(\\' + expUrl + ').*$')
      if (url.match(regExp)) {
        return true
      }
    }
  }
  return excludeUrls.includes(url)
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
  static request (p, op) {
    if (!instance) {
      initAxios(op)
    }
    return promisic(instance)(p)
  }

  static get (url, { params = {} }, options) {
    return this.request({ url, params, method: 'GET' }, options)
  }

  static post (url, { data = {} }, options) {
    return this.request({ url, data, method: 'POST' }, options)
  }
}

export { Http }
