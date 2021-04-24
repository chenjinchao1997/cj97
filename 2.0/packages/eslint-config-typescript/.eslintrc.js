module.exports = {
    extends: [
        '@cj97/eslint-config-base',
        'plugin:@typescript-eslint/recommended' // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    env: {
        browser: true,
        node: true,
        commonjs: true
    },
    rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/ban-types': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-var-requires': ['off'],
        '@typescript-eslint/no-empty-function': ['off']
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'no-undef': 'off', // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
                '@typescript-eslint/explicit-module-boundary-types': ['warn'],
                'no-empty-function': 'off',
                '@typescript-eslint/no-empty-function': ['warn']

            }
        }
    ]
}
