import { createApp } from 'vue'
import App from './app.vue'
import router from './router/index.js'

import { MotionPlugin } from '@vueuse/motion'

const app = createApp(App)
app.use(router)
app.use(MotionPlugin)

app.mount('#app')
