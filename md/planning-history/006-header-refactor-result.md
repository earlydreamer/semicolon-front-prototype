# 헤더 리팩토링 및 인증 상태 연동 (Header Refactor & Auth Store)

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

## 개요
헤더의 불필요한 '판매하기' 버튼을 제거하고, 로그인 상태(Zustand 전역 상태)에 따라 로그인/로그아웃 버튼이 동적으로 토글되도록 리팩토링했습니다. 현재 백엔드 API가 없으므로 `local storage` 기반의 영구 저장소를 사용하여 브라우저 새로고침 후에도 로그인 상태가 유지되도록 모킹했습니다.

## 주요 변경 사항

### 1. 상태 관리 (`useAuthStore`)
- **기술**: `zustand`, `zustand/middleware/persist`
- **기능**:
    - `user`: 사용자 정보 저장 (Mock Interface)
    - `isAuthenticated`: 로그인 여부 (boolean)
    - `login()`: 상태 업데이트 및 로컬 스토리지 저장
    - `logout()`: 상태 초기화 및 로컬 스토리지 삭제
- **[MOCK]**: 실제 API 연동 시 `login` 액션 내부에서 API 요청을 수행하도록 수정 필요함.

### 2. 컴포넌트 수정
#### `Header.tsx`
- '판매하기' 버튼 제거
- `useAuthStore`를 구독하여 `isAuthenticated` 값에 따라 분기 렌더링
    - **True**: 장바구니, 마이페이지 아이콘, **로그아웃** 버튼
    - **False**: **로그인**, **회원가입** 버튼

#### `LoginForm.tsx`
- 로그인 성공 시 `useAuthStore.getState().login()` 호출하여 전역 상태 업데이트
- 메인 페이지(`/`)로 리다이렉트 처리 추가

### 3. 버그 수정 (`Button.tsx`)
- **증상**: `asChild` prop 사용 시 `React.Children.only` 에러 발생.
- **원인**: `Button` 컴포넌트 내부에서 로딩 스피너 및 아이콘 렌더링을 위해 Fragment(`<>...<>`)로 감싸서 반환하던 로직이, 단일 자식을 요구하는 `Slot`(`asChild` 사용 시)과 충돌함.
- **해결**: `asChild`가 `true`인 경우, 부가적인 아이콘/로딩 UI 렌더링을 생략하고 `children`만 그대로 전달하도록 분기 처리함.

### 4. 결과 확인
- 로그인 시: 헤더 우측 상단이 `회원가입/로그인` -> `마이페이지/로그아웃` 등으로 변경됨.
- 새로고침 시: 로그인 상태 유지됨 (Zustand Persist).
- 로그아웃 시: 상태 초기화됨.
