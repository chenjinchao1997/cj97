<template>
    <div>
        <slot v-if="data" :data="data"/>

        <slot v-if="!loading && !error" name="pagination" v-bind="{ nextPage, prevPage, total, current }"/>

        <slot v-if="error" name="error" :err="error"/>

        <slot v-if="loading" name="loading"/>
    </div>
</template>

<script>

function defaultAdapter (options) {
    try {
        const resp = await fetch(options);
        return [resp, undefined];
    } catch (e) {
        return [undefined, e];
    }
}

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
        options: {
            type: Object
        },
        adapter: {
            type: Function
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
    },
    computed: {
        actualOptions () {
            return {
                url: this.api,
                method: this.method,
                ...this.options
            };
        },
        actualAdapter () {
            return this.adapter ?? defaultAdapter;
        }
    },
    mounted () {
        this.fetchData();
    },
    methods: {
        async fetchData () {
            this.toLoadingStatus();
            const [result, err] = await this.actualAdapter(this.options);
            if (result) {
                this.data = result.data;
                this.assignPaginationInfo(result);
                this.toSuccessStatus();
            } else if (err) {
                this.error = err;
                this.toErrorStatus();
            }
        },
        toLoadingStatus () {
            this.loading = true;
            this.error = undefined;
        },
        toSuccessStatus () {
            this.loading = false;
            this.error = undefined;
        },
        toErrorStatus () {
            this.loading = false;
        },
        assignPaginationInfo (resp) {
            const { pagination } = this.options;
            if (this.options.pagination) {
                const { total, current } = pagination(resp);
                this.total = total;
                this.current = current;
            } else {
                const { total, current } = resp.data;
                this.total = total;
                this.current = current;
            }
        }
    }
};
</script>

<style>

</style>
