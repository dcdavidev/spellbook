/**
 * @file Recommended `@dcdavidev` spellbook CSpell configuration.
 */

import type { CSpellSettings } from '@cspell/cspell-types';
import { ignores } from '@dcdavidev/shared-spells';

import { DICTIONARIES } from '../dictionaries.js';
import { words } from '../words.js';

/**
 * Recommended CSpell configuration.
 * Enables the multilingual and programming dictionaries, the curated custom
 * words and ignores the shared spellbook paths.
 */
export const recommended: CSpellSettings = {
  version: '0.2',
  name: 'dcdavidev-cspell-recommended-config',
  description: 'Recommended CSpell configuration preset',
  enabled: true,
  enableGlobDot: true,
  language: 'en,es,it,fr,de',
  loadDefaultConfiguration: true,
  ignorePaths: [...ignores.all],
  allowCompoundWords: true,
  dictionaries: DICTIONARIES,
  words,
};

export default recommended;
