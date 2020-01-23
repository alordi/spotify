<template>
  <div class="about">
    <h1>{{info}}</h1>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'About',
  data: () => ({
    info: 'TBD'
  }),
  mounted () {
    axios
      .get('/me')
      .then(response => {
        console.log(response)
        this.info = response
      })
  },
  methods: {}
}

</script>
