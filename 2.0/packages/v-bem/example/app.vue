<template>
    <div id="app" v-bem:root>
        <div v-bem:first,second v-bem:first&disabled="true" v-bem:empty_element,square.block>
            <div v-bem:content v-bem:[test]>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
    components: {},
    data () {
        return {
            test: '#disabled',
            haha: true
        };
    },
    mounted () {
        window.haha = this;
    }
};
</script>

<style>
* {
    padding: 5px;
}
.app {}
</style>
