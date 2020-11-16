<template>
    <div>
        <slot
            v-if="data"
            :data="data"
        />

        <slot
            v-if="!loading && !error"
            name="pagination"
            v-bind="{ nextPage, prevPage, total, current }"
        />

        <slot
            v-if="error"
            name="error"
            :err="error"
        />

        <slot
            v-if="loading"
            name="loading"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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
        options: {
            type: Object,
            default: () => ({})
        },
        adapter: {
            type: Function,
            default: fetch
        },
    },
    setup(props) {
        return {};
    }
});
</script>
