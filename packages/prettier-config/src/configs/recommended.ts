/**
 * @file Recommended Prettier configuration preset for Spellbook.
 */

import type { Config } from 'prettier';

import { recommendedOverrides } from '../overrides.js';
import { recommendedPlugins } from '../plugins.js';
import { baseRules } from '../rules.js';

/**
 * Recommended Prettier configuration combining base rules and universal plugins.
 */
export const recommended: Config = {
  ...baseRules,
  plugins: [...recommendedPlugins],
  overrides: [...recommendedOverrides],
} satisfies Config;

export default recommended;
