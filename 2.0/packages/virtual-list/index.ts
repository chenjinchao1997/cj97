import { PluginFunction } from 'vue/types/umd'

import LifeCycleInstall, { LifeCycle } from './src/life-cycle'
import IntersectionList from './src/IntersectionList.vue'

export {
    LifeCycle,
    IntersectionList
}

export default class VueObserveVisibilityPlugin {
    static install: PluginFunction<never> = function (vue) {
        vue.use(LifeCycleInstall)
        vue.component('intersection-list', IntersectionList)
    }
}
