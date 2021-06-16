import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default {
    root: './example',
    base: 'example',
    port: 3001,
    proxy: {},
    plugins: [vue(), vueJsx()]
};
