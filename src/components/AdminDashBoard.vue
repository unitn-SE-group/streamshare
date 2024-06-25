<script setup>
import * as animations from '@/utils/motionPluginOptions.js'
</script>
<script>
export default {
  name: 'AdminDashBoard',
  data() {
    return {
      items: []
    }
  },
  methods: {
    async uploadContent() {
      const formData = new FormData()
      const title = document.querySelector('#file-title').value
      const file = document.querySelector('#file-source').files[0]
      formData.append('title', title)
      formData.append('file', file)

      if (title && file) {
        const dialog = document.querySelector('dialog')
        dialog.close()
      }
      console.log(formData)
      fetch('http://localhost:3000/content', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: formData
      }).then(async (response) => {
        console.log(response)
        if (response.ok) {
          location.reload()
        }
      })
    },
    remove_content(id) {
      fetch(`http://localhost:3000/content/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      }).then(async (response) => {
        if (response.ok) {
          location.reload()
        }
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

    fetch('http://localhost:3000/content', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    }).then(async (response) => {
      if (response.ok) {
        const content = await response.json()
        return (this.items = content['catalog'].map((file) => ({
          id: file.id,
          filename: file.filename
        })))
      }
    })

    let current_url = window.location.href
    if (current_url.includes('accessToken')) {
      let admin_dashboard = current_url.includes('admin-dashboard')
      let url = new URL(current_url)
      let accessToken = url.searchParams.get('accessToken')
      let refreshToken = url.searchParams.get('refreshToken')
      sessionStorage.setItem('accessToken', accessToken)
      sessionStorage.setItem('refreshToken', refreshToken)
      if (admin_dashboard) {
        this.$router.push('/admin-dashboard')
      } else {
        this.$router.push('/dashboard')
      }
    }
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
            <button class="btn-secondary" @click="remove_content(item.id)">Remove</button>
            <div class="image text-body" :data-id="item.id">{{ index }}</div>
            <p class="text-body">{{ item.filename }}</p>
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
              <label class="text-body" for="file-title">Title</label>
              <input class="text-body" id="file-title" type="text" name="title" required />
            </div>
            <div v-motion="animations.onScrollFadeUpD0" class="form-group">
              <label class="text-body" for="title-source">Source file</label>
              <input class="text-body" id="file-source" type="file" name="file" required />
            </div>
          </form>
          <div class="button-bar">
            <button class="btn-secondary close-modal">Close</button>
            <button type="submit" class="btn-primary" @click="this.uploadContent()">Upload</button>
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
<style scoped>
.image {
  display: grid;
  place-items: center;
  font-size: 5rem;
  padding: 3rem;
}
</style>
