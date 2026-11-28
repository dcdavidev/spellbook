/**
 * @file Registry of the flat configurations exposed by the plugin.
 */

import type { Linter } from 'eslint';

import css from './css.js';
import json from './json.js';
import markdown from './markdown.js';
import nextjs from './nextjs.js';
import { recommended } from './recommended.js';
import shellBash from './shell-bash.js';

/**
 * Names of the flat configurations exposed by the plugin.
 */
export type ESLintConfig =
  'recommended' | 'nextjs' | 'css' | 'json' | 'markdown' | 'shell-bash';

/**
 * Dictionary mapping all supported configuration names to their respective flat configurations.
 */
export const configs: Record<ESLintConfig, Linter.Config[]> = {
  recommended: recommended,
  nextjs: nextjs,

  css: css,
  json: json,
  markdown: markdown,
  'shell-bash': shellBash,
};

export { recommended as configRecommended } from './recommended.js';
