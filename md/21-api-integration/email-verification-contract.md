# Email Verification Contract (Frontend Render Only)

## 목적
- 이메일 링크 클릭 시 백엔드가 먼저 토큰 검증(`verify`)을 수행
- 검증 결과를 프론트 페이지로 리다이렉트
- 프론트는 API 재호출 없이 결과 화면만 렌더

## 프론트 페이지
- Path: `/email/verify`
- Query params
1. `verified`: `true | false` (필수)
2. `email`: 인증 대상 이메일 (성공 시 선택)
3. `message`: 사용자 표시 문구 (선택)

## 백엔드 리다이렉트 포맷
성공:
```text
${FRONTEND_BASE_URL}/email/verify?verified=true&email=${urlEncodedEmail}&message=${urlEncodedMessage}
```

실패:
```text
${FRONTEND_BASE_URL}/email/verify?verified=false&message=${urlEncodedMessage}
```

예시:
```text
http://localhost:5173/email/verify?verified=true&email=user%40example.com&message=%EC%9D%B8%EC%A6%9D%20%EC%99%84%EB%A3%8C
```

## 백엔드 verify 엔드포인트 동작
- 기존 `GET /api/v1/users/email/verify?token=...`는 유지
- JSON 응답 대신 HTTP 302 리다이렉트 응답으로 프론트 URL 이동

## 프론트 처리 규칙
1. `verified=true`면 성공 화면 + 로그인 이동 버튼 노출
2. `verified=false` 또는 누락 시 실패 화면 노출
3. `message`가 없으면 프론트 기본 문구 사용
