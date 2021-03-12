<template>
    <div
        id="app"
    >
        <intersection-list
            :list="list"
            style="height: 500px;width: 100%;"
            :options="{
                root: 'default',
                rootMargin: '30px'
            }"
            @visible-change="visibleChange"
        >
            <template #default="{ item, visible }">
                <div
                    class="item"
                    :style="{
                        'background-color': visible ? 'green' : 'red'
                    }"
                >
                    {{ item.id }}
                </div>
            </template>
        </intersection-list>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

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
        visibleChange (id: number, item: any, visible: boolean) {
            // item.visible = visible
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
