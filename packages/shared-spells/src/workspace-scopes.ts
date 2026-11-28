/**
 * @file Scopes constants and scope enumeration generator for commitlint and
 * czg.
 */

import { listWorkspacePackages } from './discover-workspace-scopes.js';
import { getScopeDescription } from './get-workspace-scopes-description.js';

/**
 * Commit scopes that are always allowed, whatever the workspace contains.
 */
export const STATIC_SCOPES: readonly string[] = ['release'];

/**
 * Discovers the names of the workspace packages, excluding the root package,
 * without throwing.
 *
 * The scopes are computed when this module is imported, so a failure here
 * (for example when no package manager is installed) must not crash every
 * tool that loads the commit configuration.
 *
 * @returns The workspace package names, or an empty list.
 */
function discoverScopes(): string[] {
  try {
    return listWorkspacePackages()
      .filter(({ isRoot }) => !isRoot)
      .map(({ name }) => name)
      .toSorted((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

/**
 * Array of all valid commit scopes: the static scopes followed by the
 * workspace package names.
 */
export const scopesArray: string[] = [
  ...new Set([...STATIC_SCOPES, ...discoverScopes()]),
];

/**
 * Record of scopes mapped to their human-readable descriptions for the
 * commitlint prompt.
 */
export const scopesEnum: Record<string, { description: string }> =
  Object.fromEntries(
    scopesArray.map((scope) => [
      scope,
      { description: getScopeDescription(scope) },
    ]),
  );
