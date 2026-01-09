import type { Rule } from 'eslint';
import type { ImportDeclaration } from 'estree';
import {
  extractLayerFromPath,
  extractLayerFromImport,
  isInvalidLayerImport,
  getInvalidImportMessage,
  type FSDLayerConfig,
} from '../utils/fsd-layers';

type MessageIds = 'invalidLayerImport';

interface RuleOptions extends FSDLayerConfig {
  // Additional options can be added here
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce Feature-Sliced Design layer import rules (lower layers cannot import from upper layers)',
      recommended: true,
      url: 'https://github.com/taylous/eslint-plugin-fsd-pattern#layer-imports',
    },
    messages: {
      invalidLayerImport:
        'Layer "{{currentLayer}}" cannot import from higher layer "{{importedLayer}}". Import path: "{{importPath}}"',
    },
    schema: [
      {
        type: 'object',
        properties: {
          usePlural: {
            type: 'boolean',
            description: 'Whether to use plural form for layer names (default: true)',
            default: true,
          },
          customLayers: {
            type: 'object',
            description: 'Custom layer name mappings',
            properties: {
              app: { type: 'string' },
              pages: { type: 'string' },
              widgets: { type: 'string' },
              features: { type: 'string' },
              entities: { type: 'string' },
              shared: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options: RuleOptions = context.options[0] || {};
    const filename = context.filename || context.getFilename();

    // Extract the current file's layer
    const currentLayer = extractLayerFromPath(filename, options);

    // If current file is not in any FSD layer, skip checking
    if (!currentLayer) {
      return {};
    }

    return {
      ImportDeclaration(node: ImportDeclaration) {
        const importPath = node.source.value;

        // Only check string imports
        if (typeof importPath !== 'string') {
          return;
        }

        // Skip relative imports within same directory
        if (importPath.startsWith('.')) {
          return;
        }

        // Skip node_modules imports
        if (!importPath.startsWith('@/') &&
            !importPath.startsWith('~/') &&
            !importPath.match(/^(app|pages?|widgets?|features?|entities|shared)/)) {
          return;
        }

        // Extract the imported layer
        const importedLayer = extractLayerFromImport(importPath, options);

        // If imported path is not from any FSD layer, skip
        if (!importedLayer) {
          return;
        }

        // Check if the import violates FSD layer rules
        if (isInvalidLayerImport(currentLayer, importedLayer)) {
          context.report({
            node: node.source,
            messageId: 'invalidLayerImport',
            data: {
              currentLayer,
              importedLayer,
              importPath,
            },
          });
        }
      },
    };
  },
};

export default rule;
