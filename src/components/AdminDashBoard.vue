<script setup>
import * as animations from '@/utils/motionPluginOptions.js'
</script>
<script>
export default {
  name: 'AdminDashBoard',
  methods: {
    remove_content() {}
  },
  data() {
    return {
      //   items: this.retrieve_content()
    }
  },
  methods: {
    remove_content(index) {
      this.items.splice(index, 1)
    },
    retrieve_content() {
      fetch('http://localhost:3000/content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      })
        .then(async (response) => {
          items = await response.json()
          return content
        })
        .catch((error) => {
          console.error('Error:', error)
          return []
        })
    }
  },
  mounted() {
    const dialog = document.querySelector('dialog')
    const showButton = document.querySelector('dialog + .btn-primary')
    const closeButton = document.querySelector('.close-modal')

    showButton.addEventListener('click', () => {
      dialog.showModal()
    })

    closeButton.addEventListener('click', () => {
      dialog.close()
    })
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
          <div
            class="generic-col admin-dash-content-item"
            v-for="(item, index) in items"
            :key="index"
          >
            <button class="btn-secondary" @click="remove_content(index)">Remove</button>
            <div class="image"></div>
            <p class="text-body">{{ item.title }} - {{ item.id }}</p>
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
      <div v-motion="animations.onScrollFadeInD0" class="button-bar">
        <dialog>
          <h2 class="text-subheading">Upload content</h2>
          <form class="generic-form">
            <div v-motion="animations.onScrollFadeUpD0" class="form-group">
              <label class="text-body" for="title">Title</label>
              <input
                class="text-body"
                v-model="Title"
                type="text"
                id="title"
                name="title"
                required
              />
            </div>
            <div v-motion="animations.onScrollFadeUpD0" class="form-group">
              <label class="text-body" for="title">Source file</label>
              <input class="text-body" type="file" id="file" name="file" required />
            </div>
          </form>
          <div class="button-bar">
            <button class="btn-secondary close-modal">Close</button>
            <button type="submit" class="btn-primary">Upload</button>
          </div>
        </dialog>
        <a href="#" class="btn-primary" role="button">Upload content</a>
        <!-- <a href="#" class="btn-secondary" role="button">Remove content</a> -->
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
