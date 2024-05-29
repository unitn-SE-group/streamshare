<script setup>
import * as animations from '@/utils/motionPluginOptions.js'
</script>
<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      UserType: 'consumer',
      FirstName: '',
      LastName: '',
      Gender: '',
      DOB: '',
      Email: '',
      Password: '',
      RepeatPassword: ''
    }
  },
  methods: {
    handleSubmit() {
      if (this.Password == this.RepeatPassword) {
        const userData = {
          UserType: this.UserType,
          FirstName: this.FirstName,
          LastName: this.LastName,
          Gender: this.Gender,
          DOB: this.DOB,
          Email: this.Email,
          Password: this.Password
        }

        fetch(`${window.location.origin}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
          })
          .catch((error) => {
            // Handle any errors
            console.error(error)
          })
      }
    }
  }
}
</script>
<template>
  <div class="section-wrapper login-wrapper">
    <div v-motion="animations.onScrollFadeIn" class="generic-col login-inner">
      <h2 v-motion="animations.onScrollFadeInD0" class="text-heading">Register</h2>
      <form @submit.prevent="handleSubmit">
        <div v-motion="animations.onScrollFadeUpD0" class="generic-row form-group">
          <div class="generic-col form-col">
            <label class="text-body" for="FirstName">First Name</label>
            <input
              class="text-body"
              v-model="FirstName"
              type="text"
              id="FirstName"
              name="FirstName"
              required
            />
          </div>
          <div class="generic-col form-col">
            <label class="text-body" for="LastName">Last Name</label>
            <input
              class="text-body"
              v-model="LastName"
              type="LastName"
              id="LastName"
              name="LastName"
              required
            />
          </div>
        </div>
        <div class="generic-row form-group">
          <div class="generic-col form-col">
            <label for="Gender" class="text-body">Gender</label>
            <select name="Gender" id="Gender" class="text-body">
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>
          <div class="generic-col form-col">
            <label class="text-body" for="DOB">Date of Birth</label>
            <input class="text-body" type="date" id="DOB" name="DOB" required />
          </div>
        </div>
        <div v-motion="animations.onScrollFadeUpD0" class="form-group">
          <label class="text-body" for="email">Username</label>
          <input class="text-body" type="email" id="username" name="username" required />
        </div>
        <div v-motion="animations.onScrollFadeUpD0" class="form-group">
          <label class="text-body" for="email">Email</label>
          <input class="text-body" type="email" id="username" name="username" required />
        </div>
        <div v-motion="animations.onScrollFadeUpD1" class="form-group">
          <label class="text-body" for="password">New password</label>
          <input class="text-body" type="password" id="password" name="password" required />
        </div>
        <div v-motion="animations.onScrollFadeUpD2" class="form-group">
          <label class="text-body" for="password">Repeat password</label>
          <input class="text-body" type="password" id="newPassword" name="password" required />
        </div>
        <div v-motion="animations.onScrollFadeUpD3" class="form-group">
          <button class="btn-primary" type="submit">Create account</button>
        </div>
      </form>
      <p v-motion="animations.onScrollFadeInD2" class="text-body">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.generic-row {
  height: auto;
  gap: 2rem;
}
</style>
