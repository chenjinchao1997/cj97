module.exports = {
    parser: 'vue-eslint-parser',
    extends: [
        'plugin:vue/vue3-recommended'
    ],
    rules: {
        'vue/html-indent': ['error', 4]
    },
    env: {
        browser: true,
        node: true,
        commonjs: true
    },
    overrides: [
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
        {
            files: ['*.vue'],
            rules: {
                'no-undef': 'off'
            }
        }
    ]
}
