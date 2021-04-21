<template>
    <div id="app">
        <div style="width: 100px">
            <MiddleEllipsis text="赋能 抓手 手抓饼 赋能 抓手 手抓饼 我的烤面筋" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'App',
    created () {
        (window as unknown as any).ctx = this
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
