<template>
  <div class="body">
    <div class="login" v-if="logged_out">
      <h2> Login to Spotify </h2>
      <a href="/login">Login HERE</a>
    </div>
    <div class="main" v-if="logged_in">
      <h2> Testing Testing 123 </h2>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Login from '@/components/Login.vue'

export default {
  name: 'home',
  data: () => ({
    logged_in: false,
    logged_out: true
  }),
  mounted () {
    if (this.$route.query.status === 'ok') {
      this.logged_in = true
      this.logged_out = false
    }
  }
}
</script>
