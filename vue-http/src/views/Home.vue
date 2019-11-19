<template>
  <div class="home">
    Hello
  </div>
</template>

<script>

export default {
  name: 'home',
  created () {
    this.$http.request({
      url: '/resource.php',
      data: {
        'aa': 'aa'
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST'
    }).then(res => {
    })
  }
}
</script>
