/**
 * @file Prettier parser and path overrides for specific file formats.
 */

import type { Config } from 'prettier';

/**
 * Single file override entry type for Prettier configuration.
 */
export type OverrideEntry = NonNullable<Config['overrides']>[number];

/**
 * File override configuring JSON parser for Commitizen rc configuration files (`.czrc`).
 */
export const czrcOverride: OverrideEntry = {
  files: '**/.czrc',
  options: {
    parser: 'json',
  },
};

/**
 * File override for JSON with Comments (`.jsonc`) files to disable trailing commas.
 */
export const jsoncOverride: OverrideEntry = {
  files: '*.jsonc',
  options: {
    trailingComma: 'none',
  },
};

/**
 * File override for TOML configuration files with an expanded print width.
 */
export const tomlOverride: OverrideEntry = {
  files: ['*.toml'],
  options: {
    printWidth: 100,
  },
};

/**
 * File override configuring XML parser for SVG, XML, plist, project files, and application manifests.
 */
export const xmlOverride: OverrideEntry = {
  files: [
    '**/*.xml',
    '**/*.svg',
    '**/*.xhtml',
    '**/*.xsd',
    '**/*.xsl',
    '**/*.xslt',
    '**/*.plist',
    '**/*.axml',
    '**/*.xaml',
    '**/*.config',
    '**/*.resx',
    '**/*.csproj',
    '**/*.vbproj',
  ],
  options: {
    parser: 'xml',
  },
};

/**
 * File override configuring Astro parser for `.astro` files.
 */
export const astroOverride: OverrideEntry = {
  files: ['*.astro'],
  options: {
    parser: 'astro',
  },
};

/**
 * File override configuring Svelte parser for `.svelte` files.
 */
export const svelteOverride: OverrideEntry = {
  files: ['*.svelte'],
  options: {
    parser: 'svelte',
  },
};

/**
 * Aggregated override entries using built-in parsers for the base configuration preset.
 */
export const baseOverrides: OverrideEntry[] = [czrcOverride, jsoncOverride];

/**
 * Aggregated override entries included in the recommended configuration preset.
 */
export const recommendedOverrides: OverrideEntry[] = [
  ...baseOverrides,
  tomlOverride,
  xmlOverride,
];

/**
 * All file override entries combined for the comprehensive preset.
 */
export const allOverrides: OverrideEntry[] = [
  ...recommendedOverrides,
  astroOverride,
  svelteOverride,
];

/**
 * Dictionary of individual and aggregated file override presets.
 */
export interface PrettierOverrides {
  /**
   * JSON parser override for Commitizen rc files (`.czrc`).
   */
  readonly czrc: OverrideEntry;
  /**
   * Override for JSON with Comments (`.jsonc`) files without trailing commas.
   */
  readonly jsonc: OverrideEntry;
  /**
   * Override for TOML configuration files with an expanded print width.
   */
  readonly toml: OverrideEntry;
  /**
   * XML parser override for SVG, XML, plist, project files, and manifests.
   */
  readonly xml: OverrideEntry;
  /**
   * Astro parser override for `.astro` files.
   */
  readonly astro: OverrideEntry;
  /**
   * Svelte parser override for `.svelte` files.
   */
  readonly svelte: OverrideEntry;
  /**
   * Override entries using built-in parsers, for the base preset.
   */
  readonly base: OverrideEntry[];
  /**
   * Override entries included in the recommended preset.
   */
  readonly recommended: OverrideEntry[];
  /**
   * All override entries, for the comprehensive preset.
   */
  readonly all: OverrideEntry[];
}

/**
 * Dictionary of individual and aggregated file override presets.
 */
export const overrides: PrettierOverrides = {
  czrc: czrcOverride,
  jsonc: jsoncOverride,
  toml: tomlOverride,
  xml: xmlOverride,
  astro: astroOverride,
  svelte: svelteOverride,
  base: baseOverrides,
  recommended: recommendedOverrides,
  all: allOverrides,
};

/**
 * Valid override identifier keys.
 */
export type OverrideKey = keyof typeof overrides;
