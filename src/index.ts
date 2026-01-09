import type { ESLint, Linter } from 'eslint';
import layerImports from './rules/layer-imports';

const plugin: ESLint.Plugin = {
  meta: {
    name: 'eslint-plugin-fsd-pattern',
    version: '0.1.0',
  },
  rules: {
    'layer-imports': layerImports,
  },
  configs: {},
};

// Recommended configuration for ESLint 9 flat config
const recommendedConfig: Linter.FlatConfig = {
  plugins: {
    'fsd-pattern': plugin,
  },
  rules: {
    'fsd-pattern/layer-imports': 'error',
  },
};

plugin.configs = {
  recommended: recommendedConfig,
};

export default plugin;
