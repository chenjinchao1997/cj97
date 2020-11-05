module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        '@vue/typescript',
    ],
    parserOptions: {
        'parser': '@typescript-eslint/parser',
        'ecmaVersion': 12,
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    plugins: [
        'vue',
        'standard',
        '@typescript-eslint'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/script-indent': ['error', 4],
        'vue/html-indent': ['error', 4],
        'indent': ['error', 4],
        'prefer-const': ['error', { 'destructuring': 'all' }],
        'quotes': [2, 'single'],
        'semi': ['error', 'always']
    }
};
