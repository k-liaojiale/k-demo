import axios from 'axios'
import { promisic, settLocalStorage, getLocalStorage } from './util'

const getAccessToken = function () {
  let accessToken = getLocalStorage('accessToken')
  // accessToken不存
  if (!accessToken) {
    // 调用刷新token
    doRefreshToken('accessToken')
    // 再次获取accessToken
    accessToken = getLocalStorage('accessToken')
  }
  return accessToken
}

const doRefreshToken = async function () {
  // 标识token处于刷新状态
  window.isRefreshing = true
  let refreshToken = getLocalStorage('refreshToken')
  if (!refreshToken) {
    console.log('refreshToken已过期')
    return
  }
  const res = await promisic(axios)({
    baseURL: '',
    method: 'get',
    url: '/api/getAccessToken.php?refreshToken=' + refreshToken,
    data: {}
  })
  settLocalStorage('refreshToken', res.data.refresh_token)
  settLocalStorage('accessToken', res.data.access_token, res.data.expires_in - 10 * 60) // 提前十分钟过期
  // 标识token刷新完成
  window.isRefreshing = false
}

export {
  getAccessToken,
  doRefreshToken
}
