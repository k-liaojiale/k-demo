<template>
  <div class="home">
    Login
  </div>
</template>

<script>
import { Login } from '@/model/login'
import { Token } from '@/model/token'

export default {
  name: 'login',
  async created () {
    const res = await Login.login('kefong', '123456')
    if (res.error) {
      alert(res.error_description || '登录失败')
      return
    }
    Token.save(res.access_token, res.refresh_token, res.expires_in)
  }
}
</script>
