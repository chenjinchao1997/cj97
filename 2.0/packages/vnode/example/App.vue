<template>
    <div id="app">
        <vnode :r="renderFunction" />
    </div>
</template>

<script lang="ts">
import Vue, { CreateElement, RenderContext } from 'vue'

export default Vue.extend({
    name: 'App',
    data () {
        return {
            list: Array(100).fill(0).map((v, i) => ({
                id: i
                // visible: false
            }))
        }
    },
    created () {
        (window as unknown as any).ctx = this
    },
    methods: {
        renderFunction (h: CreateElement, ctx: RenderContext<any>) {
            console.log(ctx)
            return h('div', 'haha')
        }
    }
})
</script>

<style>
#app {
    width: 100%;
    height: 100%;
}

.item {
  height: 20px;
  margin: 5px 0;
  width: 100%;
}

.item+.item {
  margin-top: 10px;
}
</style>
