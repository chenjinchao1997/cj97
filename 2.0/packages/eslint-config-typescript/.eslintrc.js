module.exports = {
    extends: [
        '@cj97/eslint-config-base',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    rules: {
        'no-unused-vars': 'warn',
    },
    overrides: [
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
        {
            files: ['*.ts'],
            rules: {
                'no-undef': 'off'
            }
        }
    ]
};