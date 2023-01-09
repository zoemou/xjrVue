<template>
  <div>
    <avue-video ref="video"
                :width="300"></avue-video>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      }

    }
  },
  created () {
    setTimeout(() => {
      this.handleLogin()
    }, 4000)
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  methods: {
    handleLogin () {
      this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
        for(var i=0;i<this.tagWel.length;i++){
        	this.$router.push({ path: this.tagWel[i].value });
        }
      });
    }
  }
}
</script>

<style>
</style>