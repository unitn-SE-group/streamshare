<script setup>
import * as animations from '@/utils/motionPluginOptions.js'
</script>
<script>
export default {
  name: 'NavBar',
  data() {
    return {
      loggedIn: this.checkCookie()
    }
  },
  methods: {
    checkCookie() {
      if (sessionStorage.getItem('accessToken')) {
        return true
      } else {
        return false
      }
    },
    logout() {
      fetch('http://localhost:3000/auth/logout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      }).then(async (response) => {
        if (response.ok) {
          sessionStorage.removeItem('accessToken')
          sessionStorage.removeItem('refreshToken')
          this.loggedIn = false
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>

<template>
  <div class="navigation-wrapper">
    <div v-motion="animations.onScrollFadeDownD1" class="navigation-inner">
      <a href="../" class="logo">
        <img src="@/assets/images/logo_256_accent_gradient.png" alt="StreamShare" />
      </a>
      <ul class="generic-row navigation" role="menubar">
        <li>
          <router-link to="/" class="text-body" role="menuitem" aria-label="Home">Home</router-link>
        </li>
        <li>
          <router-link to="/dashboard" class="text-body" role="menuitem" aria-label="Home"
            >Dashboard</router-link
          >
        </li>
      </ul>
      <router-link to="/login" v-if="!loggedIn" class="btn-primary" role="button"
        >Watch</router-link
      >
      <router-link to="#" v-else class="btn-primary" role="button" @click="logout()"
        >Logout</router-link
      >

      <div class="mobile-menu-button">
        <input
          class="check"
          type="checkbox"
          role="checkbox"
          aria-checked="false"
          aria-label="Menu mobile toggle"
        />
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>

        <div id="popup-menu" class="popup-menu" aria-label="Menu mobile">
          <ul role="list">
            <li role="listitem" class="text-body">
              <a href="#" role="link" aria-label="Home">Home</a>
            </li>
            <li role="listitem" class="text-body">
              <a href="#" role="link" aria-label="Menu">About</a>
            </li>
            <li role="listitem" class="text-body">
              <a href="#" role="link" aria-label="Galleria">Contacts</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
