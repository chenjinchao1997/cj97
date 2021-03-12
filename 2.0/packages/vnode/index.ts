import Vue from 'vue'
export default Vue.extend({
    functional: true,
    props: {
        r: {
            type: Function,
            required: true
        }
    },
    render: (h, ctx) => ctx.props.r(h, ctx)
})
