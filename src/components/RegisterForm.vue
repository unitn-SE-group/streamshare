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
      Username: '',
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
          userType: this.UserType,
          email: this.Email,
          FirstName: this.FirstName,
          LastName: this.LastName,
          username: this.Username,
          gender: this.Gender,
          password: this.Password,
          birthDay: this.DOB
        }

        fetch(`http://localhost:3000/api/register`, {
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
            if (error.response.status == 409) {
              console.log('User already exists')
            }
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
            <label class="text-body" for="firstName">First Name</label>
            <input
              class="text-body"
              v-model="FirstName"
              type="text"
              id="firstName"
              name="firstName"
              required
            />
          </div>
          <div class="generic-col form-col">
            <label class="text-body" for="lastName">Last Name</label>
            <input
              class="text-body"
              v-model="LastName"
              type="text"
              id="lastName"
              name="lastName"
              required
            />
          </div>
        </div>
        <div class="generic-row form-group">
          <div class="generic-col form-col">
            <label for="gender" class="text-body">Gender</label>
            <select v-model="Gender" name="gender" id="gender" class="text-body">
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>
          <div class="generic-col form-col">
            <label class="text-body" for="DOB">Date of Birth</label>
            <input v-model="DOB" class="text-body" type="date" id="DOB" name="DOB" required />
          </div>
        </div>
        <div v-motion="animations.onScrollFadeUpD0" class="form-group">
          <label class="text-body" for="username">Username</label>
          <input
            v-model="Username"
            class="text-body"
            type="text"
            id="username"
            name="username"
            required
          />
        </div>
        <div v-motion="animations.onScrollFadeUpD0" class="form-group">
          <label class="text-body" for="email">Email</label>
          <input v-model="Email" class="text-body" type="email" id="email" name="email" required />
        </div>
        <div v-motion="animations.onScrollFadeUpD1" class="form-group">
          <label class="text-body" for="password">New password</label>
          <input
            v-model="Password"
            class="text-body"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <div v-motion="animations.onScrollFadeUpD2" class="form-group">
          <label class="text-body" for="repeatPassword">Repeat password</label>
          <input
            v-model="RepeatPassword"
            class="text-body"
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            required
          />
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
