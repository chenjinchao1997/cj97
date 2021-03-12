import Vue from 'vue'
import App from './App.vue'

import Vnode from '@cj97/vnode'

Vue.config.productionTip = false

Vue.component('vnode', Vnode)

new Vue({
    render: h => h(App)
}).$mount('#app')
