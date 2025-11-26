import globals from 'globals';
import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import eslintConfigPrettier from 'eslint-config-prettier';
import js from '@eslint/js';

export default defineConfigWithVueTs(
  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/node_modules/**',
    'frontend/bindings/**',
    '*.min.js',
    '.obsidian/**',
    '.stfolder/**',
  ]),

  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,vue}'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info', 'group', 'groupCollapsed', 'groupEnd', 'table'],
        },
      ],
      'no-unused-vars': 'warn',
      // 禁止使用嵌套的三元表达式
      'no-nested-ternary': 'error',
      // 调用构造函数必须带括号
      'new-parens': 'error',
      // this别名
      'consistent-this': ['error', '_this'],
      // 对象中的属性和方法使用简写
      'object-shorthand': 'error',
      // 不要省括号
      curly: 'error',
      // switch
      'default-case': 'error',
      // const
      'prefer-const': 'error',
      // 模板字符串
      'prefer-template': 'error',
    },
  },
);
