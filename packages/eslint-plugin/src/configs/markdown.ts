/**
 * @file ESLint flat configuration for Markdown files using `@eslint/markdown`.
 */

import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { ignores } from '@dcdavidev/shared-spells';
import markdownPlugin from '@eslint/markdown';

/**
 * Markdown flat ESLint configuration.
 * Lints `.md` files as GitHub Flavored Markdown with the
 * `@eslint/markdown` recommended rules and formats them through Prettier.
 */
export const markdown: Linter.Config[] = defineConfig([
  globalIgnores([...ignores.all]),

  {
    files: ['**/*.md'],
    plugins: { markdown: markdownPlugin },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },

  prettierRecommended,
]);

export default markdown;
