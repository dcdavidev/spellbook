/**
 * @file Main entry point for commitlint-config-spellbookx.
 * Exports conventional commit configuration, rules, and prompt settings.
 */

import type { UserConfig } from '@commitlint/types';

import { prompt } from './prompt.js';
import { rules } from './rules.js';

/**
 * Shareable Commitlint configuration preset enforcing conventional commits.
 */
export const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules,
  prompt,
};

export default config;
