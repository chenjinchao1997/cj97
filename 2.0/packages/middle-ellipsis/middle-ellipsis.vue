<style lang="less">
.middle-ellipsis {
    overflow: visible;
    width: 100%;
    height: 100%;
    white-space: nowrap;
}
</style>

<template>
    <div class="middle-ellipsis" ref="textbox">{{ ellipsisText }}</div>
</template>

<script>
export default {
    name: 'middle-ellipsis',
    props: {
        percent: {
            type: Number,
            default: 50,
        },
        prefix: {
            type: String,
            default: '',
        },
        suffix: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            required: true,
        },
        ellipsis: {
            type: String,
            default: '...',
        },
    },
    data() {
        return {
            ellipsisText: '',
        };
    },
    watch: {
        text: {
            immediate: true,
            async handler() {
                this.ellipsisText = await this.update();
            },
        },
    },
    methods: {
        async update() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            await this.$nextTick();
            const el = this.$refs.textbox;
            const style = window.getComputedStyle(el);
            const clientWidth = el.clientWidth - 1; // 这里防止clientWidth四舍五入
            const [fontSize, fontFamily] = [
                style.getPropertyValue('font-size'),
                style.getPropertyValue('font-family'),
            ];
            context.font = `${fontSize} ${fontFamily}`;
            const { prefix, text, suffix } = this;
            const [prefixWidth, textWidth, suffixWidth] = [
                Math.ceil(context.measureText(prefix).width),
                Math.ceil(context.measureText(text).width),
                Math.ceil(context.measureText(suffix).width),
            ];
            const needWidth = prefixWidth + textWidth + suffixWidth;
            if (needWidth < clientWidth) {
                return prefix + text + suffix;
            }
            const ellipsisWidth = Math.ceil(
                context.measureText(this.ellipsis).width
            );
            const remainWidth =
                clientWidth - suffixWidth - prefixWidth - ellipsisWidth;
            const leftWidth = Math.floor(remainWidth * (this.percent / 100));
            const rightWidth = Math.floor(remainWidth * (this.percent / 100));

            const measureText = (text, width) => {
                let index = 0;
                let tempTextWidth = 0;
                while (tempTextWidth < width) {
                    index++;
                    const tmp = text.slice(0, index);
                    tempTextWidth = context.measureText(tmp).width;
                }
                return text.slice(0, index - 1);
            };

            const leftText = measureText(text, leftWidth);
            const _rightText = measureText(
                text.split('').reverse().join(''),
                rightWidth
            );
            const rightText = _rightText.split('').reverse().join('');
            return prefix + leftText + '...' + rightText + suffix;
        },
    },
};
</script>
