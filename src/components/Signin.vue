<template>
  <div>
    <button v-on:click="signIn">Sign In</button>
    <button v-on:click="signOut">Sign Out</button>
    <button v-on:click="revoke">Revoke</button>
    <div>status: {{googleAuthStatus}}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { googleApi, GoogleAuthStatus } from '@/models/googleApi'

export default Vue.extend({
  name: 'Signin',

  mounted () {
    googleApi.init()
    googleApi.listenForSigninStatus(this.onSigninStatusChange)
  },
  data () {
    return {
      googleAuthStatus: googleApi.getAuthStatus()
    }
  },

  methods: {
    signIn: async function () {
      await googleApi.signIn()
    },
    signOut: async function () {
      await googleApi.signOut()
    },
    revoke: async function () {
      await googleApi.revoke()
    },
    onSigninStatusChange: function (status: GoogleAuthStatus) {
      this.googleAuthStatus = status
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
