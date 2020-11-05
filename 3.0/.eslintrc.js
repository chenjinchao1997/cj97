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
        'ecmaVersion': 12,
        'parser': '@typescript-eslint/parser',
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
        'indent': ['error', 4],
        'prefer-const': ['error', { 'destructuring': 'all' }],
        'quotes': [2, 'single'],
        'semi': ['error', 'always']
    }
};
