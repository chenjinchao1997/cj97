
<template>
    <div
        ref="container"
        class="intersection-list"
    >
        <div
            v-if="$slots.before"
            class="intersection-list__slot"
        >
            <slot name="before" />
        </div>
        <div class="intersection-list__list">
            <template v-if="canRender">
                <div
                    v-for="item of list"
                    :key="item[keyField]"
                    ref="items"
                    v-life-cycle="onEvent"
                    class="intersection-list__item"
                    :intersection-list-item-key="item[keyField]"
                >
                    <slot :item="item" />
                </div>
            </template>
        </div>
        <div
            v-if="$slots.after"
            class="intersection-list__slot"
        >
            <slot name="after" />
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
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        const listIntersectionObserver: { val: IntersectionObserver|null } = { val: null }
        return {
            canRender: false,
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
    watch: {
        canRender (v) {
            const options = Object.assign({}, this.options)
            if (!options.root) {
                options.root = this.$refs.container
            }
            console.log(options)
            if (v) this.listIntersectionObserver.val = new IntersectionObserver(this.observerCallback, options)
        }
    },
    mounted () {
        this.canRender = true
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
