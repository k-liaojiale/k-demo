import { Http } from '../utils/http'
import { settLocalStorage } from '../utils/util'

class Login {
  static clientID = 'testclient'
  static clientSecret = 'testpass'

  static async login (username, password) {
    const res = await Http.request({
      url: '/token.php',
      data: {
        grant_type: 'password',
        username,
        password,
        client_id: Login.clientID,
        client_secret: Login.clientSecret
      },
      method: 'POST'
    })
    // 存储token
    settLocalStorage('refreshToken', res.refresh_token)
    settLocalStorage('accessToken', res.access_token, res.expires_in - 10 * 60) // 提前十分钟过期
  }
}

export {
  Login
}
