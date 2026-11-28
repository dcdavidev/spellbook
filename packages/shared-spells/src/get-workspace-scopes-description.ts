/**
 * @file Human-readable descriptions of commit scopes, read from the
 * `package.json` of the workspace packages, for the commitlint and czg
 * prompts.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  type DiscoverWorkspaceScopesOptions,
  listWorkspacePackages,
} from './discover-workspace-scopes.js';

/**
 * Descriptions of the commit scopes that do not match a workspace package.
 */
export const SCOPE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  release: 'Release a new version of one or more packages',
};

/**
 * Reads the `description` field of a package `package.json`.
 *
 * @param dir - Absolute path of the package directory.
 * @returns The trimmed description, or `undefined` when it is missing, empty
 * or unreadable.
 */
function readPackageDescription(dir: string): string | undefined {
  try {
    const manifest = JSON.parse(
      readFileSync(path.join(dir, 'package.json'), 'utf8'),
    ) as { description?: unknown };
    const description =
      typeof manifest.description === 'string'
        ? manifest.description.trim()
        : '';

    return description === '' ? undefined : description;
  } catch {
    return undefined;
  }
}

/**
 * Returns a human-readable description of a commit scope.
 *
 * Scopes are resolved in this order:
 *
 * 1. Scopes listed in {@link SCOPE_DESCRIPTIONS}, such as `release`.
 * 2. Workspace package names, such as `@dcdavidev/eslint-plugin`: the
 * `description` of the package `package.json`, or a generic text when it has
 * none.
 * 3. npm scopes, such as `@dcdavidev`: a text naming the scope.
 * 4. Any other scope: a generic text naming the scope.
 *
 * The workspace packages come from `listWorkspacePackages`, which runs the
 * package manager once and caches the result. The function never throws.
 *
 * @param scope - Package name, npm scope or special scope such as `release`.
 * @param options - Working directory and optional package manager.
 * @returns Text shown next to the scope in the commit prompt.
 * @example
 * ```ts
 * getScopeDescription('@dcdavidev/eslint-plugin');
 * // => 'A shareable ESlint plugin'
 * getScopeDescription('release');
 * // => 'Release a new version of one or more packages'
 * ```
 */
export function getScopeDescription(
  scope: string,
  options: DiscoverWorkspaceScopesOptions = {},
): string {
  const known = SCOPE_DESCRIPTIONS[scope];
  if (known) return known;

  const workspacePackage = listWorkspacePackages(options).find(
    ({ name }) => name === scope,
  );
  if (workspacePackage) {
    return (
      readPackageDescription(workspacePackage.dir) ??
      `Changes to the \`${scope}\` package`
    );
  }

  if (scope.startsWith('@') && !scope.includes('/')) {
    return `Changes to the packages of the \`${scope}\` scope`;
  }

  return `Changes to \`${scope}\``;
}

/**
 * Returns the descriptions of several commit scopes.
 *
 * @param scopes - Commit scopes to describe.
 * @param options - Working directory and optional package manager.
 * @returns A record mapping each scope to its description, in the order given.
 * @example
 * ```ts
 * getWorkspaceScopesDescription(['release', '@dcdavidev/eslint-plugin']);
 * // => {
 * //   release: 'Release a new version of one or more packages',
 * //   '@dcdavidev/eslint-plugin': 'A shareable ESlint plugin',
 * // }
 * ```
 */
export function getWorkspaceScopesDescription(
  scopes: readonly string[],
  options: DiscoverWorkspaceScopesOptions = {},
): Record<string, string> {
  return Object.fromEntries(
    scopes.map((scope) => [scope, getScopeDescription(scope, options)]),
  );
}

export default getScopeDescription;
