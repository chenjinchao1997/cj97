<template>
    <div>
        <slot v-if="data" :data="data"/>

        <slot v-if="!loading && !error" name="pagination" v-bind="{ nextPage, prevPage, total, current }"/>

        <slot v-if="error" name="error" :err="error"/>

        <slot v-if="loading" name="loading"/>
    </div>
</template>

<script>
export default {
    name: 'Fetch',
    props: {
        api: {
            type: String,
            default: ''
        },
        method: {
            type: String,
            default: 'GET'
        },
        requestPromise: {
            type: Promise,
            default: () => Promise.resolve()
        },
        key: [Number, String]
    },
    data () {
        return {
            data: undefined,
            error: undefined,
            loading: false,
            total: 0,
            current: 0
        };
    }
};
</script>

<style>

</style>
