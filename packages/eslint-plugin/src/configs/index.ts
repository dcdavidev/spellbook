import type { Linter } from 'eslint';
import { recommended } from './recommended.js';

export type ESLintConfig = 'recommended';

/**
 * Dictionary mapping all supported configuration names to their respective flat configurations.
 */
export const configs: Record<ESLintConfig, Linter.Config[]> = {
  recommended: recommended,
};

export { recommended as configRecommended };
