<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Signin/>
  </div>
</template>

<script>
// @ is an alias to /src
import Signin from '@/components/Signin.vue'

export default {
  name: 'Home',
  components: {
    Signin
  }
}
</script>
