<script>
import NavBar from '@/components/Navbar.vue'
import LoginForm from '@/components/LoginForm.vue'

export default {
  components: {
    NavBar,
    LoginForm
  }
}
</script>

<template>
  <NavBar></NavBar>
  <LoginForm></LoginForm>
  <RouterView></RouterView>
</template>
