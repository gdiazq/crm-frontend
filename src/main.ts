import './assets/main.css'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueTippy)
app.component('VueDatePicker', VueDatePicker)
app.component('v-select', vSelect)

app.mount('#app')
