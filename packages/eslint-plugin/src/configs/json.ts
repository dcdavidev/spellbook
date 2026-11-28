/**
 * @file ESLint flat configuration for JSON, JSONC and JSON5 files using
 * `@eslint/json`.
 */

import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { ignores } from '@dcdavidev/shared-spells';
import jsonPlugin from '@eslint/json';

/**
 * JSON flat ESLint configuration.
 * Applies the `@eslint/json` recommended rules with the right language per
 * file: `json/json` for `*.json`, `json/jsonc` for `*.jsonc`, `tsconfig*.json`
 * and `.vscode/*.json` (which allow comments), and `json/json5` for `*.json5`.
 */
export const json: Linter.Config[] = defineConfig([
  globalIgnores([...ignores.all]),

  {
    files: ['**/*.json'],
    ignores: ['**/tsconfig*.json', '**/.vscode/*.json'],
    plugins: { json: jsonPlugin },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc', '**/tsconfig*.json', '**/.vscode/*.json'],
    plugins: { json: jsonPlugin },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.json5'],
    plugins: { json: jsonPlugin },
    language: 'json/json5',
    extends: ['json/recommended'],
  },

  prettierRecommended,
]);

export default json;
