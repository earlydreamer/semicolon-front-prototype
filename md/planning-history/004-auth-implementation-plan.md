# 인증 기능 구현 계획 (Auth Implementation Plan)

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

**목표**: 로그인 및 회원가입 페이지 UI 및 폼 로직 구현 (Mock 데이터 활용)

## User Review Required
> [!NOTE]
> 백엔드 API가 없는 상태이므로, 실제 로그인 요청 대신 `setTimeout`을 사용한 Mock 비동기 처리로 로그인 성공/실패 시나리오를 시뮬레이션합니다.
> 소셜 로그인은 UI 버튼만 구현하고 클릭 시 준비 중 알림을 띄웁니다.

## Proposed Changes

### Feature Components (`src/components/features/auth`)
#### [NEW] [LoginForm.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/auth/LoginForm.tsx)
- **Library**: `react-hook-form`, `zod`
- **Fields**: 이메일, 비밀번호
- **Validation**: 이메일 형식, 비밀번호 최소 길이
- **Features**: 자동 로그인 체크박스

#### [NEW] [SignupForm.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/auth/SignupForm.tsx)
- **Fields**: 이메일, 비밀번호, 비밀번호 확인, 이름, 휴대폰 번호
- **Validation**: 비밀번호 일치 여부, 휴대폰 번호 형식

#### [NEW] [SocialLoginButtons.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/auth/SocialLoginButtons.tsx)
- 카카오, 네이버, 구글 로그인 버튼 (디자인 시스템 반영)

### Pages (`src/pages`)
#### [NEW] [LoginPage.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/pages/LoginPage.tsx)
- `LoginForm` 컴포넌트 포함
- 회원가입 페이지로 이동하는 링크

#### [NEW] [SignupPage.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/pages/SignupPage.tsx)
- `SignupForm` 컴포넌트 포함

### Routing (`src/App.tsx`)
- `/login`, `/signup` 라우트 추가

## Verification Plan
### Manual Verification
- **Login**:
    - 이메일/비밀번호 유효성 검사 작동 확인
    - 로그인 버튼 클릭 시 Mock 로딩 처리 및 콘솔에 데이터 출력 확인
- **Signup**:
    - 모든 필드 입력 후 제출 동작 확인
    - 비밀번호 불일치 시 에러 메시지 표시 확인
- **Responsive**: 모바일 화면에서 폼 레이아웃 깨짐 없는지 확인
