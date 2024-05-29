<script>
import NavBar from '@/components/Navbar.vue'
import RegisterForm from '@/components/RegisterForm.vue'

export default {
  components: {
    NavBar,
    RegisterForm
  }
}
</script>

<template>
  <NavBar></NavBar>
  <RegisterForm></RegisterForm>
  <RouterView></RouterView>
</template>
