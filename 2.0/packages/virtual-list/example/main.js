import Vue from 'vue'
import App from './App.vue'

import VirtualList from '@cj97/virtual-list'

Vue.config.productionTip = false

Vue.use(VirtualList)

new Vue({
    render: h => h(App)
}).$mount('#app')
