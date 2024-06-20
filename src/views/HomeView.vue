<script>
import NavBar from '@/components/Navbar.vue'
import IndexBanner from '@/components/IndexBanner.vue'

export default {
  components: {
    NavBar,
    IndexBanner
  }
}
</script>

<template>
  <NavBar></NavBar>
  <IndexBanner></IndexBanner>
  <RouterView></RouterView>
</template>
