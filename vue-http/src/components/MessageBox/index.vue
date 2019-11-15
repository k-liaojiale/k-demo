<template>
  <div class="cover" v-show="value">
    <div class="index-cover">
      <div class="index-cover-title tac fwb" >{{ title }}</div>
      <div class="index-cover-m tac"><br>{{ message }}</div>
      <div class="index-cover-b">
        <div class="index-cover-b-l tac" @click="handleAction('cancel')">{{ cancelButtonText }}</div>
        <div class="index-cover-b-r tac ffpfm text-red" @click="handleAction('confirm')">{{ confirmButtonText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        title: '',
        message: '',
        confirmButtonText: '',
        cancelButtonText: ''
      }
    },
    methods: {
      handleAction (action) {
        var callback = this.callback
        this.value = false
        callback(action)
      }
    }
  }
</script>
