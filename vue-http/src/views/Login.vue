<template>
  <div class="home">
    Login
  </div>
</template>

<script>
import { Login } from '../model/login'

export default {
  name: 'login',
  created () {
    Login.login('kefong', '123456')
  }
}
</script>
