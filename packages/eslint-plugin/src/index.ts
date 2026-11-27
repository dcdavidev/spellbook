import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import type { ESLint } from 'eslint';
import { configs } from './configs/index.js';

const packageJsonPath = fileURLToPath(
  new URL('../package.json', import.meta.url),
);

/**
 * Parsed `package.json` metadata for `@dcdavidev/eslint-plugin`.
 */
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
  name: string;
  version: string;
  peerDependencies: Record<string, string>;
};

/**
 * Extended ESLint plugin type with strongly-typed configurations dictionary.
 */
export type Plugin = ESLint.Plugin & {
  configs: typeof configs;
};

/**
 * ESLint plugin object exposing shareable flat configurations for Spellbookx.
 */
export const plugin: Plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
    namespace: 'dcdavidev',
  },
  configs,
  rules: {},
  processors: {},
};

export default plugin;
