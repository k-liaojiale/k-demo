<template>
  <div class="home">
    Login
  </div>
</template>

<script>
import { Login } from '../model/login'
import { settLocalStorage } from '../utils/util'

export default {
  name: 'login',
  async created () {
    const res = await Login.login('kefong', '123456')
    if (res.error) {
      alert(res.error_description || '登录失败')
      return
    }
    settLocalStorage('refreshToken', res.refresh_token)
    settLocalStorage('accessToken', res.access_token, res.expires_in)
  }
}
</script>
