# eslint-plugin-fsd-pattern

ESLint plugin for enforcing [Feature-Sliced Design (FSD)](https://feature-sliced.design/) architecture patterns in JavaScript and TypeScript projects.

## Features

- ✅ **Layer Import Rules**: Enforces FSD layer hierarchy - lower layers cannot import from upper layers
- ✅ **Configurable Layer Names**: Support for both singular and plural layer names
- ✅ **TypeScript Support**: Works with both JavaScript and TypeScript projects
- ✅ **ESLint 9 Compatible**: Built for ESLint 9 with flat config support

## Installation

```bash
npm install --save-dev eslint-plugin-fsd-pattern
```

## Usage

### ESLint 9 (Flat Config)

Add to your `eslint.config.js`:

```javascript
import fsdPattern from 'eslint-plugin-fsd-pattern';

export default [
  {
    plugins: {
      'fsd-pattern': fsdPattern,
    },
    rules: {
      'fsd-pattern/layer-imports': 'error',
    },
  },
];
```

Or use the recommended configuration:

```javascript
import fsdPattern from 'eslint-plugin-fsd-pattern';

export default [
  fsdPattern.configs.recommended,
];
```

## FSD Layer Hierarchy

The plugin enforces the following layer hierarchy (from top to bottom):

1. **app** - Application initialization layer
2. **pages** - Page components
3. **widgets** - Complex UI components
4. **features** - User features and interactions
5. **entities** - Business entities
6. **shared** - Shared utilities and components

**Rule**: Lower layers (higher numbers) cannot import from upper layers (lower numbers).

### Valid Imports

```typescript
// ✅ entities can import from shared
import { Button } from '@/shared/ui/Button';

// ✅ features can import from entities and shared
import { User } from '@/entities/user';
import { api } from '@/shared/api';

// ✅ pages can import from widgets, features, entities, and shared
import { Header } from '@/widgets/header';
import { LoginForm } from '@/features/auth';

// ✅ app can import from any layer
import { HomePage } from '@/pages/home';
```

### Invalid Imports

```typescript
// ❌ shared cannot import from entities
import { User } from '@/entities/user';

// ❌ entities cannot import from features
import { useAuth } from '@/features/auth';

// ❌ features cannot import from widgets
import { Header } from '@/widgets/header';

// ❌ pages cannot import from app
import { Router } from '@/app/router';
```

## Configuration

### Options

The `layer-imports` rule accepts an options object:

```typescript
{
  usePlural?: boolean;        // Use plural layer names (default: true)
  customLayers?: {            // Custom layer name mappings
    app?: string;
    pages?: string;
    widgets?: string;
    features?: string;
    entities?: string;
    shared?: string;
  };
}
```

### Example: Singular Layer Names

If your project uses singular layer names (e.g., `page` instead of `pages`):

```javascript
export default [
  {
    plugins: {
      'fsd-pattern': fsdPattern,
    },
    rules: {
      'fsd-pattern/layer-imports': ['error', {
        usePlural: false,
      }],
    },
  },
];
```

This will check for: `app`, `page`, `widget`, `feature`, `entity`, `shared`

### Example: Custom Layer Names

```javascript
export default [
  {
    plugins: {
      'fsd-pattern': fsdPattern,
    },
    rules: {
      'fsd-pattern/layer-imports': ['error', {
        customLayers: {
          pages: 'screens',
          widgets: 'components',
        },
      }],
    },
  },
];
```

## Rules

### `layer-imports`

Enforces FSD layer import boundaries.

- **Type**: Problem
- **Recommended**: Yes
- **Fixable**: No

## Project Structure Example

```
src/
├── app/
│   ├── providers/
│   └── router/
├── pages/
│   ├── home/
│   └── profile/
├── widgets/
│   ├── header/
│   └── sidebar/
├── features/
│   ├── auth/
│   └── theme-switcher/
├── entities/
│   ├── user/
│   └── product/
└── shared/
    ├── ui/
    ├── api/
    └── lib/
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Related

- [Feature-Sliced Design](https://feature-sliced.design/) - Official FSD documentation
- [ESLint](https://eslint.org/) - Pluggable JavaScript linter
