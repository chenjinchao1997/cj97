import Vue from 'vue'
import App from './App.vue'

import MiddleEllipsis from '@cj97/middle-ellipsis'

Vue.config.productionTip = false

Vue.component('MiddleEllipsis', MiddleEllipsis)

new Vue({
    render: h => h(App)
}).$mount('#app')
