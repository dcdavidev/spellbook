/**
 * @file Lists the packages of the current workspace and the npm scopes they
 * use, by asking the workspace package manager (pnpm, Yarn, npm or Bun).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, globSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Package managers supported by {@link discoverWorkspaceScopes}.
 */
export type WorkspacePackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun';

/**
 * Options accepted by {@link discoverWorkspaceScopes}.
 */
export interface DiscoverWorkspaceScopesOptions {
  /**
   * Directory inside the workspace to start from. Defaults to `process.cwd()`.
   */
  readonly cwd?: string;
  /**
   * Package manager to use. Detected from `packageManager` or lock files
   * when omitted.
   */
  readonly packageManager?: WorkspacePackageManager;
}

/**
 * Package defined in the workspace.
 */
export interface WorkspacePackage {
  /**
   * Package name, from its `package.json`.
   */
  readonly name: string;
  /**
   * Absolute path of the package directory.
   */
  readonly dir: string;
  /**
   * Whether this is the workspace root package.
   */
  readonly isRoot: boolean;
}

/**
 * Package managers recognized in the `packageManager` field of `package.json`.
 */
const PACKAGE_MANAGERS: ReadonlySet<string> = new Set([
  'pnpm',
  'yarn',
  'npm',
  'bun',
]);

/**
 * Files that identify each package manager, in detection order.
 */
const LOCK_FILES: readonly (readonly [string, WorkspacePackageManager])[] = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['pnpm-workspace.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lock', 'bun'],
  ['bun.lockb', 'bun'],
  ['package-lock.json', 'npm'],
];

/**
 * Parses a JSON string, returning `undefined` when it is invalid.
 *
 * @param text - JSON source.
 * @returns The parsed value, or `undefined`.
 */
function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/**
 * Reads and parses a JSON file, returning `undefined` when it is missing or
 * invalid.
 *
 * @param file - Absolute path of the JSON file.
 * @returns The parsed content, or `undefined`.
 */
function readJson(file: string): unknown {
  return existsSync(file) ? parseJson(readFileSync(file, 'utf8')) : undefined;
}

/**
 * Runs a command and returns its standard output, or `undefined` when it
 * fails or is not installed.
 *
 * @param command - Executable to run.
 * @param args - Command line arguments.
 * @param cwd - Working directory.
 * @returns The trimmed standard output, or `undefined`.
 */
function run(
  command: string,
  args: readonly string[],
  cwd: string,
): string | undefined {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      shell: process.platform === 'win32',
    }).trim();
  } catch {
    return undefined;
  }
}

/**
 * Converts parsed workspace entries into packages, skipping entries without a
 * `name` or a directory.
 *
 * @param entries - Parsed workspace entries.
 * @param key - Entry field holding the package directory.
 * @param root - Directory that relative package directories resolve against.
 * @returns The workspace packages.
 */
function packagesOf(
  entries: unknown,
  key: string,
  root: string,
): Omit<WorkspacePackage, 'isRoot'>[] {
  if (!Array.isArray(entries)) return [];

  return entries
    .map((entry: Record<string, unknown> | null | undefined) => ({
      name: entry?.name,
      dir: entry?.[key],
    }))
    .filter(
      (entry): entry is { name: string; dir: string } =>
        typeof entry.name === 'string' && typeof entry.dir === 'string',
    )
    .map(({ name, dir }) => ({ name, dir: path.resolve(root, dir) }));
}

/**
 * Detects the workspace package manager by walking up from `cwd`, looking at
 * the `packageManager` field of each `package.json` and at known lock files.
 *
 * @param cwd - Directory to start from.
 * @returns The detected package manager and the directory it was found in.
 */
function detectPackageManager(
  cwd: string,
): { manager: WorkspacePackageManager; root: string } | undefined {
  let dir = path.resolve(cwd);

  for (;;) {
    const manifest = readJson(path.join(dir, 'package.json')) as
      { packageManager?: unknown } | undefined;
    const declared =
      typeof manifest?.packageManager === 'string'
        ? manifest.packageManager.split('@', 1)[0]
        : undefined;

    if (declared && PACKAGE_MANAGERS.has(declared)) {
      return { manager: declared as WorkspacePackageManager, root: dir };
    }

    for (const [file, manager] of LOCK_FILES) {
      if (existsSync(path.join(dir, file))) return { manager, root: dir };
    }

    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

/**
 * Lists workspace packages with `pnpm ls -r --depth -1 --json`.
 *
 * @param cwd - Directory inside the workspace.
 * @returns The workspace packages.
 */
function listPnpm(cwd: string): Omit<WorkspacePackage, 'isRoot'>[] {
  const output = run('pnpm', ['ls', '-r', '--depth', '-1', '--json'], cwd);
  return output ? packagesOf(parseJson(output), 'path', cwd) : [];
}

/**
 * Lists workspace packages with `yarn workspaces list --json` (Yarn 2+) or
 * `yarn workspaces info` (Yarn 1).
 *
 * @param cwd - Directory inside the workspace.
 * @param root - Workspace root, which Yarn locations are relative to.
 * @returns The workspace packages.
 */
function listYarn(
  cwd: string,
  root: string,
): Omit<WorkspacePackage, 'isRoot'>[] {
  const version = run('yarn', ['--version'], cwd);
  if (!version) return [];

  if (version.startsWith('1.')) {
    const output = run('yarn', ['--silent', 'workspaces', 'info'], cwd);
    const info = output ? parseJson(output) : undefined;
    if (!info || typeof info !== 'object') return [];

    const entries = Object.entries(info as Record<string, unknown>).map(
      ([name, value]) => ({
        name,
        location: (value as { location?: unknown } | null)?.location,
      }),
    );
    return packagesOf(entries, 'location', root);
  }

  const output = run('yarn', ['workspaces', 'list', '--json'], cwd);
  return output
    ? packagesOf(
        output.split('\n').map((line) => parseJson(line)),
        'location',
        root,
      )
    : [];
}

/**
 * Lists workspace packages with `npm query .workspace`.
 *
 * @param cwd - Directory inside the workspace.
 * @returns The workspace packages.
 */
function listNpm(cwd: string): Omit<WorkspacePackage, 'isRoot'>[] {
  const output = run('npm', ['query', '.workspace'], cwd);
  return output ? packagesOf(parseJson(output), 'path', cwd) : [];
}

/**
 * Lists workspace packages for Bun, which has no command that lists only
 * local packages: the `workspaces` globs of the root `package.json` are
 * expanded and each matched `package.json` is read.
 *
 * @param root - Workspace root directory.
 * @returns The workspace packages.
 */
function listBun(root: string): Omit<WorkspacePackage, 'isRoot'>[] {
  const manifest = readJson(path.join(root, 'package.json')) as
    { workspaces?: unknown } | undefined;
  const workspaces = manifest?.workspaces;
  const patterns: unknown = Array.isArray(workspaces)
    ? workspaces
    : (workspaces as { packages?: unknown } | undefined)?.packages;

  if (!Array.isArray(patterns)) return [];

  const globs = patterns.filter(
    (pattern): pattern is string => typeof pattern === 'string',
  );
  const include = globs
    .filter((pattern) => !pattern.startsWith('!'))
    .map((pattern) => `${pattern}/package.json`);
  const exclude = globs
    .filter((pattern) => pattern.startsWith('!'))
    .map((pattern) => `${pattern.slice(1)}/package.json`);

  const files = globSync(include, { cwd: root, exclude });

  const entries = files.map((file) => ({
    ...(readJson(path.join(root, file)) as object | undefined),
    dir: path.dirname(file),
  }));

  return packagesOf(entries, 'dir', root);
}

/**
 * Workspace packages already listed, keyed by working directory and package
 * manager, so that repeated calls do not run the package manager again.
 */
const cache = new Map<string, readonly WorkspacePackage[]>();

/**
 * Lists the packages defined in the current workspace, including the root
 * package.
 *
 * The package manager is detected from the `packageManager` field or the lock
 * files, unless given, and asked for the workspace packages:
 * `pnpm ls -r --depth -1 --json`, `yarn workspaces list --json` (Yarn 2+),
 * `yarn workspaces info` (Yarn 1) or `npm query .workspace`. For Bun the
 * `workspaces` globs of the root `package.json` are read directly.
 * Results are cached per working directory and package manager. If detection
 * or the command fails, an empty list is returned instead of throwing.
 *
 * @param options - Working directory and optional package manager.
 * @returns The workspace packages, with their names, absolute directories and
 * whether each one is the workspace root.
 * @example
 * ```ts
 * const packages = listWorkspacePackages();
 * // => [{ name: '@dcdavidev/eslint-plugin', dir: '/repo/packages/eslint-plugin', isRoot: false }, ...]
 * ```
 */
export function listWorkspacePackages(
  options: DiscoverWorkspaceScopesOptions = {},
): readonly WorkspacePackage[] {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const detected = detectPackageManager(cwd);
  const manager = options.packageManager ?? detected?.manager;
  const root = detected?.root ?? cwd;

  const key = `${manager ?? ''}:${cwd}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const listers: Record<
    WorkspacePackageManager,
    () => Omit<WorkspacePackage, 'isRoot'>[]
  > = {
    pnpm: () => listPnpm(cwd),
    yarn: () => listYarn(cwd, root),
    npm: () => listNpm(cwd),
    bun: () => listBun(root),
  };
  const packages = (manager ? listers[manager]() : []).map(
    (workspacePackage) => ({
      ...workspacePackage,
      isRoot: workspacePackage.dir === root,
    }),
  );

  cache.set(key, packages);
  return packages;
}

/**
 * Returns the npm scopes (such as `@dcdavidev`) of the packages defined in
 * the current workspace.
 *
 * The packages come from {@link listWorkspacePackages}; unscoped packages are
 * skipped. If detection or the command fails, an empty list is returned
 * instead of throwing.
 *
 * @param options - Working directory and optional package manager.
 * @returns Unique scopes, sorted alphabetically, without the trailing `/`.
 * @example
 * ```ts
 * const scopes = discoverWorkspaceScopes();
 * // => ['@dcdavidev']
 * const groups = scopes.map((scope) => `^${scope}/`);
 * ```
 */
export function discoverWorkspaceScopes(
  options: DiscoverWorkspaceScopesOptions = {},
): string[] {
  const scopes = listWorkspacePackages(options)
    .map(({ name }) => name)
    .filter((name) => name.startsWith('@') && name.includes('/'))
    .map((name) => name.slice(0, name.indexOf('/')));

  return [...new Set(scopes)].toSorted((a, b) => a.localeCompare(b));
}

export default discoverWorkspaceScopes;
