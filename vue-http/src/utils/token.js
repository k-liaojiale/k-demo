import { Http } from './http'
import { settLocalStorage, getLocalStorage } from './util'

class Token {
  static refreshing = false

  static async getAccessToken () {
    const accessToken = getLocalStorage('accessToken')
    if (!accessToken) {
      await this.doRefresh()
    }
    return getLocalStorage('accessToken')
  }

  static async doRefresh () {
    if (this.refreshing) {
      return
    }
    const refreshToken = getLocalStorage('refreshToken')
    if (!refreshToken) {
      console.log('refreshToken不存在')
      return
    }
    // 标识token处于刷新状态
    Token.refreshing = true
    const res = await Http.post({
      url: '/api/reToken.php',
      data: {
        refresh_token: refreshToken
      }
    })
    // 存储token
    settLocalStorage('accessToken', res.access_token, res.expires_in)
    settLocalStorage('refreshToken', res.refresh_token)
    // 标识token刷新完成
    Token.refreshing = false
    console.info('token刷新完成')
  }
}

export {
  Token
}
