import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['emojis.js'] }, // generated file
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
];
