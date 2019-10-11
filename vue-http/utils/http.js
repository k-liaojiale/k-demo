import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import {getLocalStorage, settLocalStorage } from '@/utils/storage'
import store from '@/store'
import { Toast } from 'mint-ui'
var config = require('@/../config')
config = process.env.NODE_ENV === 'development' ? config.dev : config.build

/* 是否有请求正在刷新token */
window.isRefreshing = false

/* 是否正在跳转 */
window.isJumping = false

/* 被挂起的请求数组 */
let refreshSubscribers = []

/* push所有请求到数组中 */
function subscribeTokenRefresh (cb) {
  refreshSubscribers.push(cb)
}

/* 刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据） */
function onRefreshed (token) {
  console.log('开始请求')
  refreshSubscribers.map(cb => cb(token))
}

var instance = axios.create({
  baseURL: config.apiUrl
  // timeout: 1000
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    var accessToken = getLocalStorage('accessToken')
    /* 判断是否存在token */
    if (accessToken) { // router.currentRoute.name !== 'login'
      config.headers.Authorization = `bearer ${accessToken}`
    } else { // token不存在则判断是否存在可用的获取refreshToken
      var refreshToken = getLocalStorage('refreshToken') // 获取refreshToken
      if (refreshToken) {
        if (!window.isRefreshing) { // 判断当前是否正在刷新token，若token在刷新则挂起请求
          /* 将刷新token的标志置为true */
          window.isRefreshing = true
          /* 刷新token */
          doRefreshToken(refreshToken)
        }
        /* 把请求(token)=>{....}都push到一个数组中 */
        let retry = new Promise((resolve, reject) => {
          /* (token) => {...}这个函数就是回调函数 */
          subscribeTokenRefresh((token) => {
            config.headers.Authorization = 'bearer ' + token
            /* 将请求挂起 */
            resolve(config)
          })
        })
        return retry
      } else {
        /* 跳转登录页 */
        router.replace({
          path: '/login',
          query: {orgId: store.state.orgId} // redirect: router.currentRoute.fullPath
        })
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err.response.status === 504) {
      Toast({
        message: '网络已断开...',
        position: 'bottom',
        duration: 3000,
        className: 'showCover'
      })
    }
    return Promise.reject(err)
  }
)

function formatReq (url, resolve, reject, data = {}, method, isUseOriginData) {
  let format = method.toLocaleLowerCase() === 'get' ? 'params' : 'data'
  let formatData = (!isUseOriginData && format === 'data') ? qs.stringify(data) : data
  instance({
    url: url,
    method: method,
    [format]: formatData,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    resolve(res)
  }).catch(err => {
    reject(err)
  })
}

// 上传
function upload (url, data = {}, resolve, reject) {
  instance({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'multipart/form-data'
    }
  }).then(res => {
    resolve(res.data)
  }).catch(() => {
    reject()
  })
};

async function doRefreshToken (refreshToken) {
  const res = await store.dispatch('refreshToken', refreshToken)
  /* 将刷新token的标志置为false */
  window.isRefreshing = false
  if (res.data.statusCode !== 10200) { // 刷新失败
    console.log('token刷新失败,响应码：' + res.data.statusCode)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    /* 跳转登录页 */
    router.replace({
      path: '/login',
      query: {orgId: store.state.orgId} // redirect: router.currentRoute.fullPath
    })
  } else {
    console.log('token刷新成功,响应码：' + res.data.statusCode)
    settLocalStorage('refreshToken', res.data.data.refresh_token)
    settLocalStorage('accessToken', res.data.data.access_token, res.data.data.expires_in)
    /* 执行数组里的函数,重新发起被挂起的请求 */
    onRefreshed(res.data.data.access_token)
    /* 执行onRefreshed函数后清空数组中保存的请求 */
    refreshSubscribers = []
  }
}

const nbwhttp = {
  get: (url, data) => {
    return new Promise((resolve, reject) => {
      formatReq(url, resolve, reject, data, 'GET', false)
    })
  },
  post: (url, data, isUseOriginData = false) => {
    return new Promise((resolve, reject) => {
      formatReq(url, resolve, reject, data, 'POST', isUseOriginData)
    })
  },
  upload: (url, data) => {
    return new Promise((resolve, reject) => {
      upload(url, data, resolve, reject)
    })
  }
}
// class Http {
//   // 使用async ... await
//   static async get(url, params) {
//     console.log(params)
//     return await instance.get(url, {params})
//   }
//   static async post(url, params) {
//     console.log(params)
//     return await instance.post(url, params);
//   }
// }

// const Http = {
//   post: (url, data) => formatReq(url, data),
// };

export default nbwhttp
