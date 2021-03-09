
<template>
    <div class="intersection-list" ref="container">
        <div
            v-life-cycle="onEvent"
            class="intersection-list__item"
            v-for="item of list"
            :key="item[keyField]"
            :intersection-list-item-key="item[keyField]"
            ref="items">
            <slot :item="item"  />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LifeCycle, EmitDirectiveEvent } from './life-cycle'

export default Vue.extend({
    name: 'IntersectionList',
    directives: { LifeCycle },
    props: {
        keyField: {
            type: String,
            default: 'id'
        },
        list: {
            type: Array,
            required: true
        }
    },
    data () {
        const listIntersectionObserver: { val: IntersectionObserver|null } = { val: null }
        return {
            listIntersectionObserver
        }
    },
    computed: {
        map () {
            const res: Record<string, any> = {}
            this.list.forEach((item: any) => {
                res[item[this.keyField]] = item
            })
            return res
        }
    },
    created () {
        this.listIntersectionObserver.val = new IntersectionObserver(this.observerCallback)
    },
    methods: {
        observerCallback (...args: Parameters<IntersectionObserverCallback>) {
            const [entries, observer] = args
            entries.forEach(entry => {
                const { target, isIntersecting } = entry
                const id = target.getAttribute('intersection-list-item-key') as string
                const item = this.map[id]
                item && (this.$emit('visible-change', item[this.keyField], item, isIntersecting))
            })
        },
        onEvent (...args: Parameters<EmitDirectiveEvent>) {
            const [event, el, binding, vnode, oldVnode] = args
            const observer = this.listIntersectionObserver.val
            if (event === 'bind') {
                observer && observer.observe(el)
            } else if (event === 'unbind') {
                observer && observer.unobserve(el)
            }
        }
    }
})
</script>

<style>

.intersection-list {
    position: relative;
    margin: auto;
    height: 100%;
    width: 100%;
    overflow: auto;
}

</style>
