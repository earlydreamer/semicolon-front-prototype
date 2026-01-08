# 인증/회원 기능

## 개요
- **목적**: OAuth 소셜 로그인, 회원가입, 계정 관리 기능 구현
- **담당자**: 이태석
- **관련 페이지**: 로그인, 회원가입, 마이페이지

## 기능 요구사항

### 인증
- [ ] OAuth 소셜 로그인 (카카오, 네이버, 구글)
- [ ] 일반 회원가입
- [ ] 로그인/로그아웃
- [ ] 토큰 관리 (Access Token + Refresh Token)
- [ ] 자동 로그인

### 회원 정보
- [ ] 회원정보 조회
- [ ] 회원정보 수정
- [ ] 비밀번호 변경
- [ ] 회원 탈퇴

### 주소 관리
- [ ] 배송지 목록 조회
- [ ] 배송지 추가/수정/삭제
- [ ] 기본 배송지 설정

### 포인트
- [ ] 포인트 잔액 조회
- [ ] 포인트 사용 내역

### 팔로우
- [ ] 사용자 팔로우/언팔로우
- [ ] 팔로잉 목록 조회
- [ ] 팔로워 목록 조회

## 컴포넌트 구조

```
components/features/auth/
├── LoginForm.tsx
├── SocialLoginButtons.tsx
├── SignupForm.tsx
├── PasswordChangeForm.tsx
└── AddressForm.tsx

pages/
├── LoginPage.tsx
├── SignupPage.tsx
└── ProfilePage.tsx
```

## API 연동 (예상)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/logout | 로그아웃 |
| POST | /api/auth/signup | 회원가입 |
| POST | /api/auth/refresh | 토큰 갱신 |
| GET | /api/auth/oauth/{provider} | 소셜 로그인 |
| GET | /api/users/me | 내 정보 조회 |
| PUT | /api/users/me | 내 정보 수정 |
| GET | /api/users/addresses | 배송지 목록 |
| POST | /api/users/addresses | 배송지 추가 |
| GET | /api/users/points | 포인트 조회 |
| POST | /api/users/{id}/follow | 팔로우 |
| DELETE | /api/users/{id}/follow | 언팔로우 |

## 주의사항
- 토큰 만료 시 자동 갱신 처리
- 민감 정보 암호화 필수
- 소셜 로그인 실패 시 fallback 처리

---

> **작성일**: 2026-01-08  
> **상태**: 대기
