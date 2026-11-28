/**
 * @file ESLint flat configuration for Next.js applications (React, React Hooks
 * and Next.js Core Web Vitals rules).
 */

import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { ignores } from '@dcdavidev/shared-spells';
import eslintReact from '@eslint-react/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';

import css from './css.js';
import js from './javascript.js';
import json from './json.js';
import markdown from './markdown.js';
import shellBash from './shell-bash.js';

/**
 * Next.js flat ESLint configuration.
 * Combines the same configs as `recommended` (JavaScript/TypeScript, JSON,
 * Markdown, CSS, Shell) with `@eslint-react` (React and Hooks rules) and
 * `@next/next` Core Web Vitals rules. Use it instead of `recommended`.
 */
export const nextjs: Linter.Config[] = defineConfig([
  globalIgnores([...ignores.all]),

  js,
  json,
  markdown,
  css,
  shellBash,

  // --- React & Next.js (JS/TS/JSX/TSX) ---
  {
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts}'],
    extends: [nextPlugin.configs['core-web-vitals']],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [eslintReact.configs.recommended],
  },
  {
    files: ['**/*.{ts,tsx,mts}'],
    extends: [eslintReact.configs['recommended-typescript']],
  },

  // --- Next.js file conventions ---
  {
    files: ['**/*.{ts,js,mts,mjs}'],
    rules: {
      // Dynamic route segments such as `[slug].ts` or `[...params].ts`.
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['__tests__', String.raw`^\[.+\]\.`],
        },
      ],
    },
  },
  {
    files: ['**/next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // must come last
  prettierRecommended,
]);

export default nextjs;
