/**
 * @file Dictionary and categorized lists of Prettier plugins supported by Spellbook.
 */

/**
 * Map of friendly plugin identifiers to their npm package names.
 */
export const plugins = {
  astro: 'prettier-plugin-astro',
  embed: 'prettier-plugin-embed',
  ini: 'prettier-plugin-ini',
  multilineArrays: 'prettier-plugin-multiline-arrays',
  'multiline-arrays': 'prettier-plugin-multiline-arrays',
  nginx: 'prettier-plugin-nginx',
  packagejson: 'prettier-plugin-packagejson',
  packageJson: 'prettier-plugin-packagejson',
  'package-json': 'prettier-plugin-packagejson',
  prisma: 'prettier-plugin-prisma',
  properties: 'prettier-plugin-properties',
  sh: 'prettier-plugin-sh',
  sql: 'prettier-plugin-sql',
  svelte: 'prettier-plugin-svelte',
  tailwind: 'prettier-plugin-tailwindcss',
  tailwindcss: 'prettier-plugin-tailwindcss',
  toml: 'prettier-plugin-toml',
  xml: '@prettier/plugin-xml',
} as const;

/**
 * Valid plugin identifier keys.
 */
export type PluginKey = keyof typeof plugins;

/**
 * Supported Prettier plugin package names.
 */
export type PluginValue = (typeof plugins)[PluginKey];

/**
 * Universal Prettier plugins suitable for a standard recommended preset.
 */
export const recommendedPlugins: readonly PluginValue[] = [
  plugins.packageJson,
  plugins.sh,
  plugins.toml,
  plugins.xml,
];

/**
 * Frontend framework-specific Prettier plugins.
 */
export const frameworkPlugins: readonly PluginValue[] = [
  plugins.astro,
  plugins.svelte,
];

/**
 * Utility-first CSS framework Prettier plugins (must be loaded last).
 */
export const cssPlugins: readonly PluginValue[] = [plugins.tailwindcss];

/**
 * Database, infrastructure, and configuration file Prettier plugins.
 */
export const infraPlugins: readonly PluginValue[] = [
  plugins.ini,
  plugins.nginx,
  plugins.prisma,
  plugins.properties,
  plugins.sql,
];

/**
 * Highly opinionated or invasive Prettier plugins for opt-in usage.
 */
export const opinionatedPlugins: readonly PluginValue[] = [
  plugins.embed,
  plugins.multilineArrays,
];
