/**
 * @file Base Prettier formatting rules shared by every Spellbook preset.
 */

import type { Config } from 'prettier';

/**
 * Prettier options excluding `plugins` and `overrides`.
 */
export type PrettierRules = Omit<Config, 'plugins' | 'overrides'>;

/**
 * Base Prettier formatting rules applied by every preset.
 */
export const baseRules: PrettierRules = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  bracketSameLine: false,
  quoteProps: 'as-needed',
  proseWrap: 'preserve',
};
