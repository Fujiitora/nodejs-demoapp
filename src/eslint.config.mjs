import globals from 'globals'
import js from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'no-var': 'error',
      'no-console': 'off',
      'no-debugger': 'off',
      'prefer-const': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: 'next|res|req',
        },
      ],

      // 💡 Enforce Prettier formatting as part of linting
      'prettier/prettier': 'error',
    },
  },
]
