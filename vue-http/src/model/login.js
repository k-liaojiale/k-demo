import { Http } from '../utils/http'

class Login {
  static clientID = 'testclient'
  static clientSecret = 'testpass'

  static async login (username, password) {
    return Http.post(
      '/login.php', {
        data: {
          username,
          password
        }
      })
  }
}

export {
  Login
}
