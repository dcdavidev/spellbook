/**
 * @file ESLint flat configuration for the spellbook monorepo.
 */

import { defineConfig } from 'eslint/config';
import dcdavidev from '@dcdavidev/eslint-plugin';

export default defineConfig([dcdavidev.configs.recommended]);
