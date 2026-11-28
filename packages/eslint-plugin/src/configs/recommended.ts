/**
 * @file Recommended ESLint flat configuration combining every language config
 * shipped by the plugin.
 */

import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { ignores } from '@dcdavidev/shared-spells';

import css from './css.js';
import js from './javascript.js';
import json from './json.js';
import markdown from './markdown.js';
import shellBash from './shell-bash.js';

/**
 * Recommended flat ESLint configuration.
 * Combines the JavaScript/TypeScript, JSON, Markdown, CSS and Shell configs,
 * ignores the shared spellbook paths and applies Prettier last. For Next.js
 * projects use `nextjs` instead.
 */
export const recommended: Linter.Config[] = defineConfig([
  globalIgnores([...ignores.all]),

  js,
  json,
  markdown,
  css,
  shellBash,

  // must come last
  prettierRecommended,
]);

export default recommended;
