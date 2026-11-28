/**
 * @file ESLint flat configuration for shell scripts using `@eslint/shell`.
 */

import type { ESLint, Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { ignores } from '@dcdavidev/shared-spells';
import shell from '@eslint/shell';

/**
 * Shell (Bash) flat ESLint configuration.
 * Lints `.sh` and `.bash` files with the `@eslint/shell` recommended
 * rules and formats them through Prettier.
 */
export const shellBash: Linter.Config[] = defineConfig([
  globalIgnores([...ignores.all]),

  {
    files: ['**/*.sh', '**/*.bash'],
    plugins: { shell: shell as unknown as ESLint.Plugin },
    language: 'shell/bash',
    extends: ['shell/recommended'],
  },

  prettierRecommended,
]);

export default shellBash;
