<template>
  <div class="home">
    Hello
  </div>
</template>

<script>
import { Http } from '../utils/http'

export default {
  name: 'home',
  created () {
    // Http.request({
    //   url: '/api/resource.php',
    //   data: {
    //     'aa': 'aa'
    //   },
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   method: 'POST'
    // }).then(res => {
    // })
    Http.get(
      '/api/login.php?aa=aa', {
        params: {
          ID: 12345
        },
        data: {
          ID: 12345
        }
      }).then(res => {
      console.log(res)
    })
  }
}
</script>
