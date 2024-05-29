<script setup>
import * as animations from '@/utils/motionPluginOptions'
</script>
<script>
export default { name: 'IndexBanner' }
</script>

<template>
  <div class="section-wrapper banner-wrapper">
    <div class="generic-col banner-inner">
      <p v-motion="animations.onScrollFadeIn" class="text-caption">Welcome</p>
      <h1 v-motion="animations.onScrollFadeUp" class="text-title">
        Collaborative streaming made easy
      </h1>
      <p v-motion="animations.onScrollFadeInD2" class="text-body">
        <span>StreamShare</span> is your all in one platform to watch your favourite content, and
        enjoy it with your friends.
      </p>
      <div v-motion="animations.onScrollFadeUpD3" class="button-bar">
        <router-link to="/about" href="#" class="btn-secondary" role="button">About</router-link>
        <router-link
          to="/login"
          v-motion="animations.onScrollFadeUpD4"
          class="btn-primary btn-shadow"
          role="button"
          >Stream now</router-link
        >
      </div>
      <div v-motion="animations.onScrollFadeInD7" class="lottie-animation-wrapper">
        <div class="lottie-arrow">
          <span></span>
          <span></span>
        </div>
        <div class="lottie-arrow">
          <span></span>
          <span></span>
        </div>
        <div class="lottie-arrow">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>
