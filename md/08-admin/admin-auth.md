# 관리자 페이지 인증 시스템

## 개요

- **목적**: 관리자 페이지 무단 접근 방지
- **진행일**: 2026-01-12
- **현재 상태**: Mock 인증 구현 (프론트엔드)

---

## 구현 내용

### 파일 목록

| 파일 | 역할 |
|------|------|
| `src/stores/useAuthStore.ts` | 관리자 인증 상태 추가 |
| `src/components/layout/AdminAuthGuard.tsx` | 인증 가드 컴포넌트 |
| `src/pages/admin/AdminLoginPage.tsx` | 관리자 로그인 페이지 |
| `src/App.tsx` | 라우팅 수정 |

### Mock 테스트 계정

- **ID**: admin
- **PW**: admin123

---

## ⚠️ 보안 주의사항

> [!CAUTION]
> **프론트엔드 가드만으로는 보안 불충분**

현재 구현은 UX 개선 목적의 임시 조치입니다. 악의적인 사용자는 브라우저 개발자 도구로 이 가드를 우회할 수 있습니다.

---

## 프로덕션 배포 전 필수 작업

1. **별도 서브도메인 분리**
   - 예: `admin.semicolon.com`
   - 일반 사용자 접근 차단

2. **백엔드 API 권한 검사**
   - 모든 관리자 API 엔드포인트에 미들웨어 적용
   - JWT 토큰 기반 인증
   - 토큰 만료 시간 설정

3. **추가 보안 레이어 (선택)**
   - IP 화이트리스트
   - 2단계 인증 (2FA)
   - 로그인 시도 제한

---

## API 연동 TODO

```typescript
// useAuthStore.ts의 adminLogin 함수 수정 필요
adminLogin: async (adminId: string, password: string) => {
  // 1. 백엔드 /api/admin/login 호출
  // 2. JWT 토큰 저장
  // 3. 권한 레벨 확인
}
```

---

## 참조

- [useAuthStore.ts](file:///d:/Projects/Programmers/Semi-Project/frontend/src/stores/useAuthStore.ts)
- [AdminAuthGuard.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/layout/AdminAuthGuard.tsx)
