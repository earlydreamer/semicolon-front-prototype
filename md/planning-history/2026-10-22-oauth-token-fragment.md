# 2026-10-22 소셜 로그인 토큰 전달 방식 변경 (쿼리스트링 → URL fragment)

## 작업 목표

- 구글 OAuth2 로그인 성공 시 access/refresh 토큰이 콜백 URL 쿼리스트링에 실려 브라우저 히스토리, Referer, Vercel·프록시 접근 로그에 남던 문제를 막는다.
- 백엔드 변경: [earlydreamer/semicolon-backend-forked#16](https://github.com/earlydreamer/semicolon-backend-forked/pull/16)

---

## 인증 계약

- 백엔드는 로그인 성공 시 `{FRONTEND}/oauth/google/callback#accessToken=…&refreshToken=…`로 리다이렉트한다.
  - refresh 토큰이 없으면 `accessToken`만 담는다.
  - 실패 시에는 기존대로 `?error=<reason>` 쿼리스트링을 쓴다(토큰 없음).
- fragment는 서버로 전송되지 않으므로 Vercel 접근 로그와 Referer에 토큰이 남지 않는다.

## 변경 내역

### fix(auth): 소셜 로그인 토큰을 fragment에서 읽고 주소창에서 제거

**`src/utils/oauthCallback.ts`**
- `readOAuthCallbackTokens(hash, search)`: fragment 값을 우선 읽고, 없으면 쿼리스트링을 읽는다.

**`src/pages/SocialLoginCallbackPage.tsx`**
- 첫 렌더에서 한 번만 토큰을 읽어 상태로 고정한다(주소를 지운 뒤 재렌더돼도 유지).
- 토큰을 읽은 직후 `history.replaceState`로 fragment·쿼리스트링을 제거한다.

## 호환성과 배포 순서

- 쿼리스트링 읽기는 백엔드 배포 전 구 응답을 받기 위한 **임시 호환**이다.
- 배포 순서: **프론트(real-data) 먼저 → 백엔드(dev) 나중.** 반대로 하면 구 프론트가 fragment를 읽지 못해 로그인이 실패한다.
- 백엔드 반영과 운영 확인이 끝나면 쿼리스트링 보조 읽기는 제거해도 된다.
