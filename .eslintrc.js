module.exports = {
    'root': true,
    'env': {
        'browser': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        '@vue/typescript',
    ],
    'parserOptions': {
        'ecmaVersion': 12,
        'parser': '@typescript-eslint/parser',
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    'plugins': [
        'vue',
        'standard',
        '@typescript-eslint'
    ],
    'rules': {
        'indent': ['error', 4],
        'prefer-const': ['error', { 'destructuring': 'all' }],
        'quotes': [2, 'single']
    }
};
