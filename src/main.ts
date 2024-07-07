import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { init_router } from './router/mod.router'

const app = createApp(App)
const router = init_router()

app.use(router)

app.mount('#app')
