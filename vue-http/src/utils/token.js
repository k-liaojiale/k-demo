import axios from 'axios'
import { promisic, settLocalStorage, getLocalStorage } from './util'

class Token {
  static refreshing = false

  static getAccessToken () {
    return getLocalStorage('accessToken')
  }

  static async refresh () {
    if (Token.refreshing) {
      return
    }

    let refreshToken = getLocalStorage('refreshToken')
    if (!refreshToken) {
      console.log('refreshToken已过期')
      // refreshToken过期出来 -- 跳转登陆页
      return
    }

    // 标识token处于刷新状态
    Token.refreshing = true
    const res = await promisic(axios)({
      baseURL: '',
      method: 'POST',
      url: '/api/token.php',
      data: {
        grant_type: 'refresh_token',
        client_id: 'testclient',
        client_secret: 'testpass',
        refresh_token: refreshToken
      }
    })
    // 存储token
    Token.save(res)
    // 标识token刷新完成
    Token.refreshing = false
    console.info('token刷新完成')
  }

  static save (r) {
    settLocalStorage('accessToken', r.access_token, r.expires_in - 10 * 60) // 提前十分钟过期
    settLocalStorage('refreshToken', r.refresh_token)
  }
}

export {
  Token
}
