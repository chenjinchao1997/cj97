module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'indent': ['error', 4],
    'vue/script-indent': ['error', 4],
    'vue/html-indent': ['error', 4],
    'prefer-const': ['error', { 'destructuring': 'all' }],
    'quotes': [2, 'single'],
    'semi': ['error', 'always']
  },
  plugins: [
    'vue',
    'standard',
    '@typescript-eslint'
  ],
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
