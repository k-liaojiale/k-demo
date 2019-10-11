import axios from 'axios'
import qs from 'qs'
var config = require('@/../config')
config = process.env.NODE_ENV === 'development' ? config.dev : config.build

export default {
  refreshToken (state, refreshToken) {
    return new Promise((resolve, reject) => {
      axios({
        baseURL: config.apiUrl,
        method: 'post',
        url: '/refreshToken',
        data: qs.stringify({
          refreshToken: refreshToken
        })
      }).then(response => {
        // 成功返回
        resolve({data: response.data})
      }).catch(error => {
        // 失败返回
        resolve({data: error})
      })
    })
  }
}
