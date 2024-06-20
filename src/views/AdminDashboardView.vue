<script>
import NavBar from '@/components/Navbar.vue'
import AdminDashBoard from '@/components/AdminDashBoard.vue'

export default {
  components: {
    NavBar,
    AdminDashBoard
  }
}
</script>

<template>
  <NavBar></NavBar>
  <AdminDashBoard></AdminDashBoard>
  <RouterView></RouterView>
</template>
