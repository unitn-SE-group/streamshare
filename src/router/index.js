import '@/assets/css/_reset.css'
import '@/assets/css/admin-dashboard.css'
import '@/assets/css/login.css'
import '@/assets/css/style.css'

import { createWebHistory, createRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/admin-dashboard', component: AdminDashboardView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
