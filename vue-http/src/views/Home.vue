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
    Http.request({
      url: '/api/getProducts.php?page=1'
    }).then(res => {
      console.log(res)
    })
    Http.request({
      url: '/api/getProducts.php?page=1'
    }).then(res => {
      console.log(res)
    })
  }
}
</script>
