<script setup>
import * as animations from '@/utils/motionPluginOptions.js'
</script>
<script>
export default {
  name: 'LoginForm',
  methods: {
    togglePassword() {
      const password_input = document.querySelector('#password')
      const show_password = document.querySelector('#show-password-img')
      if (password_input.type === 'password') {
        password_input.type = 'text'
        show_password.src = 'src/assets/images/lock.png'
      } else {
        password_input.type = 'password'
        show_password.src = 'src/assets/images/unlock.png'
      }
    }
  }
}
</script>
<template>
  <div class="section-wrapper login-wrapper">
    <div v-motion="animations.onScrollFadeIn" class="generic-col login-inner">
      <h2 v-motion="animations.onScrollFadeInD0" class="text-heading">Login</h2>
      <form>
        <div v-motion="animations.onScrollFadeUpD0" class="form-group">
          <label class="text-body" for="email">Email</label>
          <input class="text-body" type="email" id="username" name="username" required />
        </div>
        <div v-motion="animations.onScrollFadeUpD1" class="form-group">
          <label class="text-body" for="password">Password</label>
          <input class="text-body" type="password" id="password" name="password" required />
          <div id="show-password" @click="togglePassword()">
            <img id="show-password-img" src="@/assets/images/unlock.png" alt="" />
          </div>
          <a class="text-body" href="#">Forgot your password?</a>
        </div>
        <div v-motion="animations.onScrollFadeUpD2" class="form-group">
          <button class="btn-primary" type="submit">Confirm</button>
        </div>
      </form>
      <p v-motion="animations.onScrollFadeInD2" class="text-body">
        Don't have an account yet? <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper .login-inner form .form-group #show-password {
  translate: 0 -15%;
}
</style>
