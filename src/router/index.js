import '@/assets/css/_reset.css'
import '@/assets/css/login.css'
import '@/assets/css/style.css'

import { createWebHistory, createRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
