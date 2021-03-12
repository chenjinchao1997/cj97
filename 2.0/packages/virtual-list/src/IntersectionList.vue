
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
        <div
            class="intersection-list__wrapper"
            :class="wrapperClass"
        >
            <template v-if="canRender">
                <div
                    v-for="v of wrappedList"
                    :key="v.item[keyField]"
                    ref="items"
                    v-life-cycle="onEvent"
                    :intersection-list-item-key="v.item[keyField]"
                    class="intersection-list__item"
                    :class="itemClass"
                >
                    <slot
                        :item="v.item"
                        :visible="v.visible"
                    />
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
        },
        itemClass: {
            type: String,
            default: undefined
        },
        wrapperClass: {
            type: String,
            default: undefined
        }
    },
    data () {
        const listIntersectionObserver: { val: IntersectionObserver|null } = { val: null }
        const wrappedList: { visible: boolean, item: any }[] = []
        const wrappedListMap: Record<string, { visible: boolean, item: any }> = {}
        return {
            canRender: false,
            listIntersectionObserver,
            wrappedList,
            wrappedListMap
        }
    },
    watch: {
        list: {
            immediate: true,
            handler (v, ov) {
                this.wrappedList = v.map((item: any) => ({
                    visible: Boolean(this.wrappedListMap[item[this.keyField]]?.visible),
                    item
                }))
                this.wrappedListMap = {}
                this.wrappedList.forEach((v: { visible: boolean, item: any }) => {
                    this.wrappedListMap[v.item[this.keyField]] = v
                })
            }
        },
        canRender (v) {
            if (!v) return
            const options = Object.assign({
                root: 'default'
            }, this.options)
            if (options.root === 'default') {
                options.root = this.$refs.container
            }
            this.listIntersectionObserver.val = new IntersectionObserver(this.observerCallback, options)
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
                const wrappedItem = this.wrappedListMap[id]
                if (wrappedItem) {
                    this.$emit('visible-change', wrappedItem.item[this.keyField], wrappedItem.item, isIntersecting)
                    wrappedItem.visible = isIntersecting
                }
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
