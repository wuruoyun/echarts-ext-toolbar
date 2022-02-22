import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'

import 'primevue/resources/themes/mdc-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)

app.use(PrimeVue)
app.directive('tooltip', Tooltip)

app.mount('#app')