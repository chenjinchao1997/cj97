module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        '@cj97/eslint-config-base',
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    rules: {
    },
};