<script setup>
import * as animations from '@/utils/motionPluginOptions.js'
</script>
<script>
export default { name: 'LoginForm' }
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
