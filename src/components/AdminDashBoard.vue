<script setup>
import * as animations from '@/utils/motionPluginOptions.js'
</script>
<script>
export default {
  name: 'AdminDashBoard',
  methods: {
    remove_content() {}
  }
}
</script>
<template>
  <div class="admin-dash-wrapper">
    <div class="generic-col admin-dash-content-wrapper">
      <h2 v-motion="animations.onScrollFadeInD0" class="text-heading">Welcome, admin</h2>
      <div v-motion="animations.onScrollFadeUpD1" class="generic-col admin-dash-content-inner">
        <h3 class="text-subheading">Popular content</h3>
        <div class="admin-dash-content-grid">
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
          <div class="generic-col admin-dash-content-item">
            <button class="btn-secondary" @click="this.remove_content()">Remove</button>
            <div class="image"></div>
            <p class="text-body">Name here</p>
          </div>
        </div>
        <!-- <a href="#" class="btn-tertiary" role="button">
          View details
          <svg
            width="23"
            height="15"
            viewBox="0 0 23 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 7.5H21M21 7.5L14.28 1M21 7.5L14.28 14" stroke="#F4F2EF" stroke-width="2" />
          </svg>
        </a> -->
      </div>
      <div v-motion="animations.onScrollFadeInD2" class="button-bar">
        <!-- <a href="#" class="btn-secondary" role="button">Remove content</a> -->
        <a href="#" class="btn-primary" role="button">Upload content</a>
      </div>
    </div>
    <!-- <div v-motion="animations.onScrollFadeUpD3" class="generic-col admin-dash-users-wrapper">
      <h3 class="text-subheading">Active users</h3>
      <div class="generic-col admin-dash-users-grid">
        <div class="generic-row admin-dash-user">
          <div class="image"></div>
          <p class="text-body bold">Username here</p>
          <div class="admin-dash-user-status"></div>
        </div>
        <div class="generic-row admin-dash-user">
          <div class="image"></div>
          <p class="text-body bold">Username here</p>
          <div class="admin-dash-user-status"></div>
        </div>
        <div class="generic-row admin-dash-user">
          <div class="image"></div>
          <p class="text-body bold">Username here</p>
          <div class="admin-dash-user-status"></div>
        </div>
        <div class="generic-row admin-dash-user">
          <div class="image"></div>
          <p class="text-body bold">Username here</p>
          <div class="admin-dash-user-status"></div>
        </div>
        <div class="generic-row admin-dash-user">
          <div class="image"></div>
          <p class="text-body bold">Username here</p>
          <div class="admin-dash-user-status"></div>
        </div>
        <div class="generic-row admin-dash-user">
          <div class="image"></div>
          <p class="text-body bold">Username here</p>
          <div class="admin-dash-user-status"></div>
        </div>
        <div class="generic-row admin-dash-user">
          <div class="image"></div>
          <p class="text-body bold">Username here</p>
          <div class="admin-dash-user-status"></div>
        </div>
      </div>
      <a href="#" class="btn-tertiary" role="button">
        View all
        <svg
          width="23"
          height="15"
          viewBox="0 0 23 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 7.5H21M21 7.5L14.28 1M21 7.5L14.28 14" stroke="#F4F2EF" stroke-width="2" />
        </svg>
      </a>
    </div> -->
  </div>
</template>
