<template>
    <div id="app">
        <intersection-list
            :list="list"
            style="height: 500px;width: 500px;"
            @visible-change="visibleChange"
        >
            <template #default="{ item }">
                <div
                    class="item"
                    :style="{
                        'background-color': item.visible ? 'green' : 'red'
                    }"
                >
                    {{ item.id }}
                </div>
            </template>
        </intersection-list>
    </div>
</template>

<script lang="ts">
export default {
    name: 'App',
    data () {
        return {
            list: Array(100).fill(0).map((v, i) => ({
                id: i,
                visible: false
            }))
        }
    },
    methods: {
        visibleChange (id: number, item: any, visible: boolean) {
            item.visible = visible
        }
    }
}
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
