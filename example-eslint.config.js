// Example ESLint configuration for projects using FSD pattern
// This file shows how to configure eslint-plugin-fsd-pattern

import fsdPattern from 'eslint-plugin-fsd-pattern';

export default [
  {
    // Using recommended configuration
    ...fsdPattern.configs.recommended,
  },
  // Or configure manually:
  // {
  //   plugins: {
  //     'fsd-pattern': fsdPattern,
  //   },
  //   rules: {
  //     'fsd-pattern/layer-imports': ['error', {
  //       usePlural: true,  // Use plural layer names (default)
  //       customLayers: {
  //         // Customize layer names if needed
  //         // pages: 'screens',
  //         // widgets: 'components',
  //       },
  //     }],
  //   },
  // },
];
