import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      'dist',
      'coverage',
      '*.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'test-background-debug.js',
      'test-background-image-debug.js',
      'upload-background-fix.js',
      'temp-test-image.js',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      ...reactHooks.configs.recommended,
      ...reactRefresh.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]|motion',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];
