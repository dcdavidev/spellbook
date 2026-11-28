/**
 * @file ESLint flat configuration for CSS files using `@eslint/css`.
 */

import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { ignores } from '@dcdavidev/shared-spells';
import cssPlugin from '@eslint/css';

/**
 * CSS flat ESLint configuration.
 * Lints `.css` files with the `@eslint/css` recommended rules and formats
 * them through Prettier.
 */
export const css: Linter.Config[] = defineConfig([
  globalIgnores([...ignores.all]),

  {
    files: ['**/*.css'],
    plugins: { css: cssPlugin },
    language: 'css/css',
    extends: ['css/recommended'],
  },

  prettierRecommended,
]);

export default css;
