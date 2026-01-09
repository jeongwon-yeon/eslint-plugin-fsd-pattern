export interface FSDLayerConfig {
  /** Custom layer names mapping */
  customLayers?: {
    app?: string;
    pages?: string;
    widgets?: string;
    features?: string;
    entities?: string;
    shared?: string;
  };
}

export const DEFAULT_LAYER_TOKENS = {
  app: 'app',
  pages: 'page',
  widgets: 'widget',
  features: 'feature',
  entities: 'entity',
  shared: 'shared',
} as const;

/**
 * FSD layer hierarchy (from top to bottom)
 * Lower layers cannot import from upper layers
 */
export const LAYER_HIERARCHY = [
  'app',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared',
] as const;

export type LayerName = (typeof LAYER_HIERARCHY)[number];

/**
 * Get configured layer names based on user settings
 */
export function getLayerTokens(config: FSDLayerConfig = {}): Record<LayerName, string> {
  const { customLayers = {} } = config;

  return {
    app: customLayers.app || DEFAULT_LAYER_TOKENS.app,
    pages: customLayers.pages || DEFAULT_LAYER_TOKENS.pages,
    widgets: customLayers.widgets || DEFAULT_LAYER_TOKENS.widgets,
    features: customLayers.features || DEFAULT_LAYER_TOKENS.features,
    entities: customLayers.entities || DEFAULT_LAYER_TOKENS.entities,
    shared: customLayers.shared || DEFAULT_LAYER_TOKENS.shared,
  };
}

function normalizeSegment(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchesLayerSegment(segment: string, token: string): boolean {
  return normalizeSegment(segment).includes(normalizeSegment(token));
}

/**
 * Extract layer name from a file path
 * @example
 * extractLayerFromPath('src/pages/home/ui/HomePage.tsx') // 'pages'
 * extractLayerFromPath('app/providers/ThemeProvider.tsx') // 'app'
 */
export function extractLayerFromPath(
  filePath: string,
  config: FSDLayerConfig = {}
): LayerName | null {
  const layerTokens = getLayerTokens(config);
  const normalizedPath = filePath.replace(/\\/g, '/');
  const pathSegments = normalizedPath.split('/');

  // Try to match any of the configured layer names
  for (const [key, value] of Object.entries(layerTokens)) {
    if (pathSegments.some((segment) => matchesLayerSegment(segment, value))) {
      return key as LayerName;
    }
  }

  return null;
}

/**
 * Extract layer name from an import path
 * @example
 * extractLayerFromImport('@/pages/home') // 'pages'
 * extractLayerFromImport('entities/user') // 'entities'
 */
export function extractLayerFromImport(
  importPath: string,
  config: FSDLayerConfig = {}
): LayerName | null {
  const layerTokens = getLayerTokens(config);

  // Remove path alias prefix like '@/', '~/', etc.
  const normalizedImport = importPath.replace(/^[@~]\//, '').replace(/^[@~]/, '');
  const [firstSegment] = normalizedImport.split('/');

  // Check if import starts with a layer name
  for (const [key, value] of Object.entries(layerTokens)) {
    if (firstSegment && matchesLayerSegment(firstSegment, value)) {
      return key as LayerName;
    }
  }

  return null;
}

/**
 * Get the hierarchy level of a layer (lower number = higher in hierarchy)
 */
export function getLayerLevel(layer: LayerName): number {
  return LAYER_HIERARCHY.indexOf(layer);
}

/**
 * Check if importing from upperLayer to lowerLayer violates FSD rules
 * @returns true if the import is invalid (lower layer importing from upper layer)
 */
export function isInvalidLayerImport(
  currentLayer: LayerName,
  importedLayer: LayerName
): boolean {
  const currentLevel = getLayerLevel(currentLayer);
  const importedLevel = getLayerLevel(importedLayer);

  // Invalid if current layer is lower in hierarchy (higher number)
  // and tries to import from upper layer (lower number)
  return currentLevel > importedLevel;
}

/**
 * Get a human-readable error message for invalid layer import
 */
export function getInvalidImportMessage(
  currentLayer: LayerName,
  importedLayer: LayerName,
  importPath: string
): string {
  return `Layer "${currentLayer}" cannot import from higher layer "${importedLayer}". Import path: "${importPath}"`;
}
