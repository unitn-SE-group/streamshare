<script setup>
import { jwtDecode } from 'jwt-decode'
</script>
<script>
export default {
  name: 'DashBoard',
  mounted() {
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

    try {
      const decoded = jwtDecode(sessionStorage.getItem('accessToken'))
      if (decoded.usertype === 'admin') {
        this.$router.push('/admin-dashboard')
      } else {
        this.$router.push('/dashboard')
      }
    } catch (error) {}
  }
}
</script>
<template></template>
