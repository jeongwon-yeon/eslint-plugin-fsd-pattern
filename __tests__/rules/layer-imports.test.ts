import { RuleTester } from 'eslint';
import rule from '../../src/rules/layer-imports';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('layer-imports', rule, {
  valid: [
    // shared can import from shared
    {
      code: "import { Button } from '@/shared/ui/Button';",
      filename: '/project/src/shared/components/Card.tsx',
    },
    // entities can import from shared
    {
      code: "import { api } from '@/shared/api';",
      filename: '/project/src/entities/user/api.ts',
    },
    // features can import from entities
    {
      code: "import { User } from '@/entities/user';",
      filename: '/project/src/features/auth/model.ts',
    },
    // features can import from shared
    {
      code: "import { Button } from '@/shared/ui';",
      filename: '/project/src/features/auth/ui/LoginForm.tsx',
    },
    // widgets can import from features
    {
      code: "import { LoginForm } from '@/features/auth';",
      filename: '/project/src/widgets/header/ui/Header.tsx',
    },
    // widgets can import from entities
    {
      code: "import { User } from '@/entities/user';",
      filename: '/project/src/widgets/header/ui/Header.tsx',
    },
    // widgets can import from shared
    {
      code: "import { Icon } from '@/shared/ui';",
      filename: '/project/src/widgets/sidebar/ui/Sidebar.tsx',
    },
    // pages can import from widgets
    {
      code: "import { Header } from '@/widgets/header';",
      filename: '/project/src/pages/home/ui/HomePage.tsx',
    },
    // pages can import from features
    {
      code: "import { LoginForm } from '@/features/auth';",
      filename: '/project/src/pages/login/ui/LoginPage.tsx',
    },
    // pages can import from entities
    {
      code: "import { User } from '@/entities/user';",
      filename: '/project/src/pages/profile/ui/ProfilePage.tsx',
    },
    // pages can import from shared
    {
      code: "import { Layout } from '@/shared/ui';",
      filename: '/project/src/pages/home/ui/HomePage.tsx',
    },
    // app can import from pages
    {
      code: "import { HomePage } from '@/pages/home';",
      filename: '/project/src/app/routes.tsx',
    },
    // app can import from any layer
    {
      code: "import { theme } from '@/shared/config';",
      filename: '/project/src/app/providers/ThemeProvider.tsx',
    },
    // Relative imports are allowed
    {
      code: "import { helper } from './helper';",
      filename: '/project/src/pages/home/ui/HomePage.tsx',
    },
    // Node modules imports are allowed
    {
      code: "import React from 'react';",
      filename: '/project/src/pages/home/ui/HomePage.tsx',
    },
    // Files outside FSD structure are not checked
    {
      code: "import { something } from '@/pages/home';",
      filename: '/project/utils/helper.ts',
    },
  ],

  invalid: [
    // shared cannot import from entities
    {
      code: "import { User } from '@/entities/user';",
      filename: '/project/src/shared/ui/UserCard.tsx',
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            currentLayer: 'shared',
            importedLayer: 'entities',
            importPath: '@/entities/user',
          },
        },
      ],
    },
    // shared cannot import from features
    {
      code: "import { LoginForm } from '@/features/auth';",
      filename: '/project/src/shared/ui/Button.tsx',
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            currentLayer: 'shared',
            importedLayer: 'features',
            importPath: '@/features/auth',
          },
        },
      ],
    },
    // entities cannot import from features
    {
      code: "import { useAuth } from '@/features/auth';",
      filename: '/project/src/entities/user/model.ts',
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            currentLayer: 'entities',
            importedLayer: 'features',
            importPath: '@/features/auth',
          },
        },
      ],
    },
    // entities cannot import from widgets
    {
      code: "import { Header } from '@/widgets/header';",
      filename: '/project/src/entities/user/ui/UserCard.tsx',
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            currentLayer: 'entities',
            importedLayer: 'widgets',
            importPath: '@/widgets/header',
          },
        },
      ],
    },
    // features cannot import from widgets
    {
      code: "import { Sidebar } from '@/widgets/sidebar';",
      filename: '/project/src/features/navigation/ui/Menu.tsx',
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            currentLayer: 'features',
            importedLayer: 'widgets',
            importPath: '@/widgets/sidebar',
          },
        },
      ],
    },
    // features cannot import from pages
    {
      code: "import { HomePage } from '@/pages/home';",
      filename: '/project/src/features/navigation/model.ts',
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            currentLayer: 'features',
            importedLayer: 'pages',
            importPath: '@/pages/home',
          },
        },
      ],
    },
    // widgets cannot import from pages
    {
      code: "import { ProfilePage } from '@/pages/profile';",
      filename: '/project/src/widgets/nav/ui/Nav.tsx',
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            currentLayer: 'widgets',
            importedLayer: 'pages',
            importPath: '@/pages/profile',
          },
        },
      ],
    },
    // pages cannot import from app
    {
      code: "import { Router } from '@/app/router';",
      filename: '/project/src/pages/home/ui/HomePage.tsx',
      errors: [
        {
          messageId: 'invalidLayerImport',
          data: {
            currentLayer: 'pages',
            importedLayer: 'app',
            importPath: '@/app/router',
          },
        },
      ],
    },
  ],
});

// Test with custom configuration (usePlural: false)
const ruleTesterSingular = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTesterSingular.run('layer-imports with usePlural: false', rule, {
  valid: [
    {
      code: "import { User } from '@/entity/user';",
      filename: '/project/src/feature/auth/model.ts',
      options: [{ usePlural: false }],
    },
    {
      code: "import { Button } from '@/shared/ui';",
      filename: '/project/src/page/home/ui/HomePage.tsx',
      options: [{ usePlural: false }],
    },
  ],
  invalid: [
    {
      code: "import { LoginForm } from '@/feature/auth';",
      filename: '/project/src/entity/user/model.ts',
      options: [{ usePlural: false }],
      errors: [
        {
          messageId: 'invalidLayerImport',
        },
      ],
    },
  ],
});

console.log('All tests passed!');
