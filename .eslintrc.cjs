module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['n8n-nodes-base', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es2021: true,
  },
  ignorePatterns: ['dist/**', 'node_modules/**'],
  rules: {
    // n8n plugin provides best practices for node development
    'n8n-nodes-base/node-class-description-extends-from-abstract': 'error',
  },
};


