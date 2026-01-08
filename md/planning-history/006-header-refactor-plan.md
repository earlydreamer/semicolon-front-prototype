# 헤더 리팩토링 및 인증 상태 관리 계획

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

**목표**: 헤더의 '판매하기' 버튼을 제거하고, 로그인 상태에 따라 로그인/로그아웃 버튼을 동적으로 표시합니다. 이를 위해 Zustand를 사용한 전역 인증 상태 관리를 도입합니다.

## User Review Required
> [!NOTE]
> '판매하기' 버튼은 요청하신 대로 임시 제거합니다.
> 로그인/로그아웃 상태 전환을 확인하기 위해 `useAuthStore`를 생성하고, 로그인 폼에서 이를 호출하도록 연동합니다.

## Proposed Changes

### State Management (`src/stores`)
#### [NEW] [useAuthStore.ts](file:///d:/Projects/Programmers/Semi-Project/frontend/src/stores/useAuthStore.ts)
- **State**: `user` (User | null), `isAuthenticated` (boolean)
- **Actions**: `login(userData)`, `logout()`
- **Persistence**: `persist` 미들웨어 사용 (새로고침 시 상태 유지)
- **Note**: 실제 API 연동 전까지 Mock 데이터로 동작함을 명시

### Layout Components (`src/components/layout`)
#### [MODIFY] [Header.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/layout/Header.tsx)
- '판매하기' 버튼 제거
- `useAuthStore` 구독
- 비로그인 시: `로그인`, `회원가입` 버튼 표시 (Link)
- 로그인 시: `로그아웃` 버튼, `마이페이지` 아이콘 등 표시

### Feature Components (`src/components/features/auth`)
#### [MODIFY] [LoginForm.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/auth/LoginForm.tsx)
- 로그인 성공 시 `useAuthStore.getState().login()` 호출
- 로그인 후 메인 페이지(`/`)로 리다이렉트

## Verification Plan
### Manual Verification
1. 헤더 초기 상태: '로그인', '회원가입' 버튼 확인 ('판매하기' 버튼 제거 확인)
2. 로그인 진행: `/login`에서 로그인 성공 시 헤더가 '로그아웃'으로 변경되는지 확인
3. 로그아웃 진행: '로그아웃' 클릭 시 다시 '로그인' 버튼으로 변경되는지 확인
