module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:playwright/recommended', 'plugin:prettier/recommended'],
  plugins: ['playwright', 'prettier'],
  rules: {
    'no-console': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'playwright/no-skipped-test': 'warn',
    'playwright/no-focused-test': 'error',
  },
  ignorePatterns: ['node_modules/', 'results/', 'dist/', '*.config.js'],
};
