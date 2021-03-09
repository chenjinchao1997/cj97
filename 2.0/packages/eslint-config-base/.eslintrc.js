module.exports = {
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
            'jsx': true
        }
    },
    env: {
        browser: true,
        node: true,
        commonjs: true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: [
        'standard'
    ],
    // http://eslint.org/docs/rules
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single', 'avoid-escape'],
        'no-unused-vars': 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    }
};
