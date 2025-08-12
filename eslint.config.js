// Flat config for ESLint v9+
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import n8nPlugin from 'eslint-plugin-n8n-nodes-base';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'n8n-nodes-base': n8nPlugin,
    },
    rules: {
      // Tune rules as the implementation grows
      'n8n-nodes-base/node-class-description-extends-from-abstract': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];


