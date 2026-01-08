# 트러블슈팅: App.tsx 구문 오류 및 React.lazy 런타임 에러

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

## 1. App.tsx 구문 오류 (Unexpected token)

### 문제 상황
- `npm run dev` 실행 시 `App.tsx:60:2` 위치에서 `Unexpected token` 에러 발생.
- `App.tsx` 파일 내부에 `DesignSystemPage` 컴포넌트 코드가 중복되어 있거나, `return` 문이 잘못된 위치에 존재하는 등 파일 내용이 꼬여 있었음.

### 원인
- 여러 번의 코드 수정 과정에서 `replace_file_content` 툴이 파일을 잘못 병합하거나, 중복된 코드가 삽입된 채로 저장됨.

### 해결
- **코드 분리**: `App.tsx` 내부에 정의되어 있던 `DesignSystemPage` 컴포넌트를 `src/pages/DesignSystemPage.tsx`로 분리.
- **구조 정리**: `App.tsx`를 깔끔하게 정리하여 라우팅 설정만 남기고, 필요한 페이지 컴포넌트들을 `lazy` import 하도록 수정.

---

## 2. React.lazy 관련 런타임 에러 (Cannot convert object to primitive value)

### 문제 상황
- `App.tsx` 수정 후 빌드는 성공했으나, 브라우저에서 `Uncaught TypeError: Cannot convert object to primitive value` 에러와 함께 화면이 렌더링되지 않음.
- 에러 스택 트레이스에 `lazyInitializer`가 포함되어 있어 `React.lazy` 관련 문제로 추정.

### 원인
- `React.lazy`는 동적으로 import 하는 모듈이 **`default export`**를 가지고 있을 것이라고 가정함.
- 그러나 `HomePage`, `LoginPage`, `SignupPage` 등은 `export function ComponentName() {}` 형태의 **Named Export**를 사용하고 있었음.
- 이로 인해 `import()` 결과 객체에 `default` 속성이 없어서 React가 컴포넌트를 찾지 못해 에러 발생.

### 해결
- 모든 페이지 컴포넌트(`HomePage.tsx`, `LoginPage.tsx`, `SignupPage.tsx`, `CategoryPage.tsx` 등)의 export 방식을 `export default function ...`으로 변경.
- 이를 통해 `React.lazy(() => import('./pages/...'))`가 정상적으로 컴포넌트를 로로드할 수 있게 됨.

## 3. 결과
- 애플리케이션이 정상적으로 구동되며, 라우팅 및 페이지 전환이 원활하게 동작함.
