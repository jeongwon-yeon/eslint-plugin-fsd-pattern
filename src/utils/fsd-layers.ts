export interface FSDLayerConfig {
  /** Whether to use plural form for layer names (e.g., 'pages' vs 'page') */
  usePlural?: boolean;
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

export const DEFAULT_LAYERS = {
  app: 'app',
  pages: 'pages',
  widgets: 'widgets',
  features: 'features',
  entities: 'entities',
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
export function getLayerNames(config: FSDLayerConfig = {}): Record<LayerName, string> {
  const { usePlural = true, customLayers = {} } = config;

  return {
    app: customLayers.app || 'app',
    pages: customLayers.pages || (usePlural ? 'pages' : 'page'),
    widgets: customLayers.widgets || (usePlural ? 'widgets' : 'widget'),
    features: customLayers.features || (usePlural ? 'features' : 'feature'),
    entities: customLayers.entities || (usePlural ? 'entities' : 'entity'),
    shared: customLayers.shared || 'shared',
  };
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
  const layerNames = getLayerNames(config);
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Try to match any of the configured layer names
  for (const [key, value] of Object.entries(layerNames)) {
    const layerPattern = new RegExp(`(?:^|/)${value}(?:/|$)`);
    if (layerPattern.test(normalizedPath)) {
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
  const layerNames = getLayerNames(config);

  // Remove path alias prefix like '@/', '~/', etc.
  const normalizedImport = importPath.replace(/^[@~]\//, '');

  // Check if import starts with a layer name
  for (const [key, value] of Object.entries(layerNames)) {
    if (normalizedImport === value || normalizedImport.startsWith(`${value}/`)) {
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
