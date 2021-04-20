import Vue from 'vue';
import App from './app.vue';
import bem from '@cj97/v-bem/index';
import '@cj97/v-bem/dist/health-check.css';

Vue.config.productionTip = false;
Vue.use(bem, 'prefix');
new Vue({
    render: h => h(App)
}).$mount('#app');
