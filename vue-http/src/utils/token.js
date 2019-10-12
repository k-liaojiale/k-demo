import axios from 'axios'
import { promisic, settLocalStorage, getLocalStorage } from './util'

class Token {
  static refreshSubscribers = []
  static isRefreshing = false

  static getAccessToken () {
    return getLocalStorage('accessToken')
  }

  static async refreshToken () {
    let refreshToken = getLocalStorage('refreshToken')
    if (!refreshToken) {
      console.log('refreshToken已过期')
      return
    }
    // 标识token处于刷新状态
    Token.isRefreshing = true
    const res = await promisic(axios)({
      baseURL: '',
      method: 'get',
      url: '/api/getAccessToken.php?refreshToken=' + refreshToken,
      data: {}
    })
    // 存储token
    settLocalStorage('refreshToken', res.data.refresh_token)
    settLocalStorage('accessToken', res.data.access_token, res.data.expires_in - 10 * 60) // 提前十分钟过期
    // 标识token刷新完成
    Token.isRefreshing = false
    Token.restartRefresh(res.data.access_token)
  }

  static subscribeTokenRefresh (func) {
    // 将请求挂起
    Token.refreshSubscribers.push(func)
  }

  static restartRefresh (token) {
    if (Token.refreshSubscribers.length > 0) {
      Token.refreshSubscribers.map(cb => cb(token))
      Token.refreshSubscribers = []
    }
  }
}

export {
  Token
}
