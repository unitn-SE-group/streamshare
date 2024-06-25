<script setup>
import * as animations from '@/utils/motionPluginOptions.js'
</script>
<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      Email: '',
      Password: ''
    }
  },
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
    },
    handleSubmit() {
      const userData = {
        email: this.Email,
        password: this.Password
      }
      fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      }).then(async (response) => {
        const { accessToken, refreshToken, user_type } = await response.json()
        if (response.ok) {
          sessionStorage.setItem('accessToken', accessToken)
          sessionStorage.setItem('refreshToken', refreshToken)
          if (user_type === 'admin') {
            this.$router.push('/admin-dashboard')
          } else {
            this.$router.push('/dashboard')
          }
        } else if (response.status == 401) {
          alert('Invalid credentials')
        } else if (response.status == 404) {
          alert('User does not exist, please register first')
        }
      })
    }
  },
  mounted() {
    let google_oauth_script = document.createElement('script')
    google_oauth_script.setAttribute('src', 'https://accounts.google.com/gsi/client')
    google_oauth_script.setAttribute('async', 'true')
    document.head.appendChild(google_oauth_script)
  }
}
</script>
<template>
  <div class="section-wrapper login-wrapper">
    <div v-motion="animations.onScrollFadeIn" class="generic-col login-inner">
      <h2 v-motion="animations.onScrollFadeInD0" class="text-heading">Login</h2>
      <form @submit.prevent="handleSubmit">
        <div v-motion="animations.onScrollFadeUpD0" class="form-group">
          <label class="text-body" for="email">Email</label>
          <input class="text-body" v-model="Email" type="email" id="email" name="email" required />
        </div>
        <div v-motion="animations.onScrollFadeUpD1" class="form-group">
          <label class="text-body" for="password">Password</label>
          <input
            class="text-body"
            v-model="Password"
            type="password"
            id="password"
            name="password"
            required
          />
          <div id="show-password" @click="togglePassword()">
            <img id="show-password-img" src="@/assets/images/unlock.png" alt="" />
          </div>
          <a class="text-body" href="#">Forgot your password?</a>
        </div>
        <div v-motion="animations.onScrollFadeUpD2" class="form-group">
          <div class="button-bar">
            <div
              id="g_id_onload"
              data-client_id="523950488324-k1p3hg7bq28u18pd4n2i3t5krq7jvgcl.apps.googleusercontent.com"
              data-login_uri="http://localhost:3000/oauth"
              data-auto_prompt="true"
            ></div>
            <div
              class="g_id_signin text-body"
              data-type="icon"
              data-size="large"
              data-text="signin"
              data-theme="outline"
              data-shape="circle"
              data-callback="OnSuccess"
              data-logo_alignment="center"
            ></div>
            <button class="btn-primary" type="submit">Confirm</button>
          </div>
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
#buttonDiv {
  width: 100px;
  height: 100px;
}
</style>
