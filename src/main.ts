import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import apiPlugin from './plugins/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(apiPlugin)
app.use(VueQueryPlugin)

app.mount('#app')
