# eslint-plugin-fsd-pattern

Feature-Sliced Design(FSD) 아키텍처의 레이어 임포트 규칙을 강제하는 ESLint 플러그인입니다. JavaScript/TypeScript 프로젝트에서 **하위 레이어가 상위 레이어를 임포트하지 못하도록** 검사합니다.

## 주요 기능

* **레이어 임포트 규칙 강제**: FSD 계층 구조 기반의 import 제약
* **플러그인 옵션 제공**: 커스텀 레이어명 매핑
* **TypeScript 지원**
* **ESLint 9 Flat Config 지원**

## 설치

```bash
npm install --save-dev eslint-plugin-fsd-pattern
```

## 사용법 (ESLint 9 Flat Config)

```js
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

### 추천 설정

```js
import fsdPattern from 'eslint-plugin-fsd-pattern';

export default [
  fsdPattern.configs.recommended,
];
```

## 규칙: layer-imports

### 동작 개요

* 파일 경로에서 현재 레이어를 추출한 뒤, import 경로의 레이어와 비교합니다.
* **하위 레이어가 상위 레이어를 임포트하면 오류**를 보고합니다.
* 상대 경로(`./`, `../`) import는 검사하지 않습니다.
* import 경로의 첫 번째 구간에 레이어 토큰(`app`, `page`, `widget`, `feature`, `entity`, `shared`)이 포함되면 레이어로 인식합니다.

### 레이어 계층 (상위 → 하위)

1. app
2. pages
3. widgets
4. features
5. entities
6. shared

**규칙**: 아래 레이어는 위 레이어를 import할 수 없습니다.

### 유효한 예시

```ts
// entities -> shared (허용)
import { Button } from '@/shared/ui/Button';

// features -> entities/shared (허용)
import { User } from '@/entities/user';
import { api } from '@/shared/api';

// pages -> widgets/features/entities/shared (허용)
import { Header } from '@/widgets/header';
import { LoginForm } from '@/features/auth';

// app -> 모든 레이어 (허용)
import { HomePage } from '@/pages/home';
```

### 오류 예시

```ts
// shared -> entities (금지)
import { User } from '@/entities/user';

// entities -> features (금지)
import { useAuth } from '@/features/auth';

// features -> widgets (금지)
import { Header } from '@/widgets/header';

// pages -> app (금지)
import { Router } from '@/app/router';
```

## 옵션

```ts
{
  customLayers?: {
    app?: string;
    pages?: string;
    widgets?: string;
    features?: string;
    entities?: string;
    shared?: string;
  };
}
```

### 커스텀 레이어명 매핑

```js
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

## 프로젝트 구조 예시

```
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

## 개발

```bash
npm run build
npm run lint
npm test
```

## 요구 사항

* Node.js >= 18
* ESLint 9 (peer dependency)

## 라이선스

## MIT
