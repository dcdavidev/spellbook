import type { Config } from 'prettier';

export type PrettierRules = Omit<Config, 'plugins' | 'overrides'>;

export const baseRules: PrettierRules = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  bracketSameLine: false,
  quoteProps: 'as-needed',
  proseWrap: 'preserve',
};
