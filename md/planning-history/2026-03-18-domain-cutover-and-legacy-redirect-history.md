# 도메인 컷오버와 레거시 리다이렉트 작업 기록

- 작성일: 2026-03-18
- 범위: 이번 대화에서 프론트엔드 저장소에서 수행한 작업, 의사결정, 운영 반영 사항 전체
- 관련 백엔드 문서: `../../../backend/semicolon-backend-forked/.md/plans/m1-cloudflare-tunnel-cutover-history/step-1-result.md`

## 1. 문서 목적

이번 대화에서는 프론트엔드가 새 공개 도메인 체계로 정상 동작하도록 설정을 정리했고, 기존 도메인 `dukku.shop` 계열을 완전한 이중 운영 대신 새 도메인으로 자연스럽게 넘기는 방향으로 마무리했다.

이 문서는 아래 항목을 빠짐없이 남기기 위한 작업 기록이다.

- API/Grafana 공개 호스트 하드코딩 제거
- Vercel 환경변수 기준 정리
- 구 도메인 접속 시 새 도메인으로 리다이렉트하는 흐름 추가
- 리다이렉트 동작 실패 원인 분석과 기본 fallback 보강
- 리다이렉트 화면 UI 정리
- WSL/Windows Git 상태 차이와 인증 경로 정리
- 블로그 포스팅용 설명 정리와 Mermaid 도식 지원

## 2. 초기 확인과 프론트 관점의 도메인 구조 정리

대화 초반에는 백엔드/Cloudflare 기준 운영 흐름을 먼저 점검했지만, 프론트 관점에서 핵심이 된 결론은 아래와 같았다.

- 웹 프론트 호스트는 `dukku.earlydreamer.dev`
- API 호스트는 `api.dukku.earlydreamer.dev`가 아니라 최종적으로 `api-dukku.earlydreamer.dev`
- Grafana 호스트는 `grafana.api-dukku.earlydreamer.dev`
- `dukku.earlydreamer.dev`와 API 호스트를 분리 유지
- 같은 루트 호스트에서 `/api`로 우회하지 않고, 별도 API 호스트 체계를 유지

이 과정에서 프론트 코드가 기존 `api.dukku.earlydreamer.dev`를 기대하고 있던 부분을 먼저 확인했고, 단순 환경변수 수정만으로 끝나지 않는다는 점을 정리했다.

## 3. 공개 호스트 하드코딩 제거와 런타임 URL 해석 정리

### 3.1 목표

기존에는 API 호스트와 Grafana 호스트가 코드 여러 위치에 하드코딩되어 있었다. 이 상태에서는 도메인 변경 시 프론트 코드, Vercel 설정, 이미지 URL fallback 등을 모두 따로 찾아 수정해야 했다.

그래서 아래 목표로 리팩터링을 진행했다.

- 공개 호스트를 런타임 환경변수 중심으로 해석
- API/Grafana URL 계산 로직을 한 곳으로 모으기
- Vercel rewrite 같은 우회성 하드코딩 제거

### 3.2 반영 내용

다음 파일들을 중심으로 정리했다.

- `src/utils/runtimeUrls.ts`
- `src/utils/api.ts`
- `src/services/productService.ts`
- `src/constants/adminNavigation.ts`
- `vercel.json`
- `.env.example`

핵심 변경은 다음과 같다.

- API base URL 계산을 `runtimeUrls.ts`로 통합
- 프로덕션 웹 호스트 목록을 환경변수 기반으로 판정
- 이미지/Grafana 관련 fallback도 같은 URL 해석 계층을 사용
- `vercel.json`의 API 관련 하드코딩 rewrite 제거

### 3.3 관련 커밋

- `16d80ff` `refactor(config): API/Grafana 공개 호스트 환경변수화`
- `9b13aaf` `fix(config): 인증 및 AI API 경로 해석 보정`
- `406897b` `docs(frontend): 워크스페이스 문서 링크 정리`

## 4. Vercel 환경변수와 로컬 `.env` 기준 정리

도메인 컷오버 후에도 브라우저에서 API 요청이 계속 `api.dukku.shop`으로 나가는 문제가 있었다. 원인은 코드가 아니라 Vercel 환경변수였다.

### 4.1 원인

- `runtimeUrls.ts` 우선순위상 `VITE_API_BASE_URL`이 설정되어 있으면 그 값이 `VITE_PUBLIC_API_BASE_URL`보다 우선
- Vercel Production 환경변수에 예전 `VITE_API_BASE_URL` 값이 남아 있었음
- 결과적으로 새 도메인으로 코드를 바꿔도 배포 결과물에는 구 API 도메인이 박혀 있었음

### 4.2 최종 정리한 값

로컬 `.env`와 Vercel 모두 아래 기준으로 정리했다.

```env
VITE_API_BASE_URL=
VITE_PUBLIC_API_BASE_URL=https://api-dukku.earlydreamer.dev
VITE_PUBLIC_WEB_HOSTS=dukku.earlydreamer.dev,www.dukku.earlydreamer.dev
VITE_GRAFANA_URL=
VITE_PUBLIC_GRAFANA_URL=https://grafana.api-dukku.earlydreamer.dev
```

중요한 포인트는 아래 두 가지였다.

- `VITE_API_BASE_URL`은 비우거나 제거
- Vite 환경변수는 빌드 시점에 고정되므로, 값 수정 후 재배포가 필수

## 5. 구 도메인 `dukku.shop` 접속 시 발생한 실제 장애

기존 도메인 `dukku.shop`을 다시 살려놓은 뒤, 해당 도메인에서는 아래와 같은 프론트 런타임 에러가 발생했다.

- `카테고리를 불러오지 못했습니다. TypeError: a.filter is not a function`
- `Cannot use 'in' operator to search for 'productUuid' in <`

### 5.1 실제 원인

처음에는 API 응답 스키마 문제가 의심됐지만, 실제 원인은 구 도메인이 `VITE_PUBLIC_WEB_HOSTS`에 포함되지 않았던 것이다.

그 결과:

1. `dukku.shop` 접속 시 프론트가 새 API 호스트를 선택하지 못함
2. 상대경로 `/api/...`로 요청
3. Vercel이 API JSON이 아니라 HTML 문서를 반환
4. 프론트가 HTML 문자열을 배열/객체로 가정하고 후속 로직을 태움
5. `filter is not a function`, `'productUuid' in '<'` 같은 에러 발생

이 이슈를 계기로 완전한 이중 도메인 지원 대신, 구 도메인을 새 도메인으로 즉시 넘기는 방향이 더 낫다고 판단했다.

## 6. 레거시 도메인 리다이렉트 전략 채택

### 6.1 왜 CORS/이중 도메인 지원을 포기했는가

처음에는 `dukku.shop`을 브라우저 origin으로 허용하고, 새 API 호스트와 함께 공존시키는 방향도 검토했다. 하지만 아래 항목까지 전부 이중 관리해야 한다는 점이 문제였다.

- Google OAuth 성공/실패 후 리다이렉트
- 이메일 인증 링크와 성공 후 이동 URL
- Toss 결제 완료/실패 후 콜백 베이스 URL
- 프론트 환경변수, 백엔드 CORS, 외부 서비스 설정의 동시 관리

즉 조회 API 몇 개만 되는 수준이 아니라, 인증/결제/메일까지 모두 분기해야 해서 운영 복잡도가 너무 커졌다.

### 6.2 최종 방향

최종적으로는 아래 방식으로 단순화했다.

- `dukku.shop`, `www.dukku.shop`로 들어오면 프론트 앱이 바로 새 도메인으로 보냄
- 경로, 쿼리스트링, 해시는 그대로 유지
- 사용자는 짧은 안내 화면만 보고 새 도메인으로 이동
- 구 도메인에서 앱을 정상 부팅시키지 않음

## 7. 레거시 리다이렉트 구현 상세

### 7.1 환경변수

리다이렉트 전용 환경변수를 추가했다.

```env
VITE_LEGACY_WEB_HOSTS=dukku.shop,www.dukku.shop
VITE_LEGACY_REDIRECT_BASE_URL=https://dukku.earlydreamer.dev
```

### 7.2 URL 계산 로직

`src/utils/runtimeUrls.ts`에 아래 역할을 추가했다.

- 레거시 호스트 목록 파싱
- 현재 hostname이 레거시 호스트인지 판정
- 새 도메인으로 목적지 URL 생성
- 현재 경로/path, query string, hash 유지
- 현재 URL과 목적지 URL이 같으면 빈 문자열을 반환해 무한 리다이렉트 방지

### 7.3 앱 초기화 가드

`src/App.tsx`에서는 레거시 리다이렉트 대상이 존재할 때 일반 초기화 로직을 건너뛰도록 바꿨다.

- `initialize()` 호출 중단
- 인증 상태 기반 장바구니 fetch 중단
- 일반 앱 렌더링 대신 `LegacyDomainRedirect` 화면 렌더링
- 일정 시간 후 `window.location.replace()` 수행

여기서 `replace()`를 사용한 이유는, 사용자가 뒤로 가기를 눌렀을 때 구 도메인으로 돌아가 다시 리다이렉트되는 루프를 막기 위해서다.

### 7.4 안내 화면

`src/components/common/LegacyDomainRedirect.tsx`를 새로 추가했다.

기능은 아래와 같다.

- “새 도메인으로 이동합니다” 안내 문구 표시
- 이동 대상 호스트와 전체 URL 표시
- 자동 이동 전 직접 이동할 수 있는 버튼 제공

### 7.5 관련 커밋

- `268b3df` `feat(domain): 구 도메인 접속 리다이렉트 추가`

## 8. 리다이렉트가 동작하지 않았던 원인과 fallback 보강

초기 구현 후에도 리다이렉트가 작동하지 않는 사례가 있었다. 원인은 배포 환경에서 레거시 관련 환경변수가 누락되면 `resolveLegacyRedirectTarget()`이 빈 문자열을 반환하는 구조 때문이었다.

### 8.1 수정 내용

`runtimeUrls.ts`에 아래 기본값을 코드 fallback으로 추가했다.

- 기본 레거시 호스트: `dukku.shop,www.dukku.shop`
- 기본 리다이렉트 베이스 URL: `https://dukku.earlydreamer.dev`
- hostname 소문자 정규화

즉 Vercel 환경변수가 비어 있어도 최소한 `dukku.shop -> dukku.earlydreamer.dev` 리다이렉트는 동작하도록 바꿨다.

### 8.2 관련 커밋

- `8e24bfb` `fix(domain): 레거시 도메인 리다이렉트 기본값 추가`

## 9. 리다이렉트 화면 UI 톤 정리

초기 안내 화면은 진행 바/펄스 바 성격이 강해서, 실제로는 멈춘 것처럼 보인다는 피드백이 있었다.

그래서 기존 앱의 공통 카드/버튼 스타일과 맞추고, 로딩 상태는 단순한 spinner로 교체했다.

### 9.1 조정 내용

- 강한 그래디언트/랜딩 페이지 느낌 제거
- 공통 `Card`, `Button` 스타일 재사용
- 펄스/바 형태 로딩 제거
- 원형 `animate-spin` 로더 사용

### 9.2 관련 커밋

- `a74d0cb` `refactor(ui): 레거시 리다이렉트 로딩 표시 개선`

## 10. 빌드 검증

이번 대화 내 프론트 주요 변경 이후에는 반복적으로 `npm run build`로 확인했다.

확인된 포인트:

- 공개 호스트 env 리팩터링 후 빌드 통과
- 레거시 리다이렉트 추가 후 빌드 통과
- 레거시 기본 fallback 추가 후 빌드 통과
- 로딩 spinner UI 변경 후 빌드 통과

## 11. Git 상태, CRLF, 인증 경로 정리

### 11.1 WSL과 Windows Git 상태가 다르게 보이던 문제

한 시점에 프론트 저장소는 WSL Git에서 많은 미커밋 변경처럼 보였는데, SourceTree/Windows Git에서는 clean 상태였다.

원인은 실제 기능 차이가 아니라 줄바꿈 해석 차이였다.

- Windows Git: `core.autocrlf=true`
- WSL Git: 같은 저장소 설정이 맞지 않았음

이후 프론트 저장소 repo-local 설정을 `core.autocrlf=true`로 맞춰서 WSL/Windows 모두 clean 상태로 보이게 정리했다.

### 11.2 WSL Git 인증 경로 통일

WSL Git이 workflow 파일 push나 원격 조회에서 Windows Git과 다른 인증 경로를 타던 문제도 있었다.

- Windows Git Credential Manager를 WSL Git helper로 맞춤
- 경로 공백 때문에 따옴표/설정 문제를 한 번 더 바로잡음

이후 프론트 기준으로는 WSL/Windows 양쪽에서 같은 원격 자격증명을 타도록 정리했다.

## 12. 프론트 저장소 기준 이번 대화 관련 커밋 정리

이번 대화에서 프론트 저장소에 반영된 대표 커밋은 아래와 같다.

| 순서 | 커밋 | 메시지 |
|---|---|---|
| 1 | `16d80ff` | `refactor(config): API/Grafana 공개 호스트 환경변수화` |
| 2 | `9b13aaf` | `fix(config): 인증 및 AI API 경로 해석 보정` |
| 3 | `406897b` | `docs(frontend): 워크스페이스 문서 링크 정리` |
| 4 | `268b3df` | `feat(domain): 구 도메인 접속 리다이렉트 추가` |
| 5 | `8e24bfb` | `fix(domain): 레거시 도메인 리다이렉트 기본값 추가` |
| 6 | `a74d0cb` | `refactor(ui): 레거시 리다이렉트 로딩 표시 개선` |

## 13. 블로그 포스팅 지원 내역

이번 대화 후반부에는 실제 포스팅 초안 작성을 위해 프론트 측 설명도 함께 정리했다.

지원한 내용은 아래와 같다.

- 레거시 리다이렉트 코드 추출과 설명 문단 정리
- `runtimeUrls.ts`, `App.tsx`, `LegacyDomainRedirect.tsx` 역할 분리 설명
- 기존 인프라/현재 인프라 Mermaid 도식 초안 작성
- 포스팅 초안 리뷰
  - `DEPLOYMENT_NOT_FOUND`는 Vercel 도메인/배포 매핑 문제라는 점 정리
  - 구 도메인 공존 대신 리다이렉트 전략으로 정리한 흐름 보강
  - 비어 있는 섹션과 표현 부정확성 점검

추가로 포스팅 검토 과정에서 아래 항목도 체크했다.

- Cloudflare route 스크린샷은 `blob:` 링크가 아니라 실제 업로드 URL이어야 함
- `cloudflared service install <token>` 관련 스크린샷은 token prefix까지 전부 가리는 것이 안전
- SSH `known_hosts` 예시는 `[localhost]:2222`보다 `[127.0.0.1]:2222`가 현재 workflow와 일치

## 14. 최종 상태

이번 대화 기준 프론트엔드의 최종 상태는 아래와 같다.

- 새 운영 웹 도메인은 `dukku.earlydreamer.dev`
- 새 API 도메인은 `api-dukku.earlydreamer.dev`
- Grafana 도메인은 `grafana.api-dukku.earlydreamer.dev`
- 구 도메인 `dukku.shop`, `www.dukku.shop`는 앱을 정상 부팅시키지 않고 새 도메인으로 안내 후 리다이렉트
- Vercel 환경변수와 로컬 `.env` 모두 새 도메인 기준으로 정리
- 리다이렉트가 배포 환경 변수 누락 시에도 동작하도록 fallback 보강 완료

## 15. 남은 운영 후속작업

프론트엔드 단에서 직접 해결하지 않은 후속 이슈도 대화 중 확인했다.

- Google OAuth 클라이언트가 팀원 계정 소유라 새 도메인 redirect URI 반영 권한이 없음
- SMTP 발송 계정도 팀원 소유라 메일 인증 운영 자격증명을 교체해야 함

이 부분은 프론트 코드보다는 운영 계정/백엔드 설정 문제에 가깝기 때문에, 상세 내용은 관련 백엔드 작업 기록에도 함께 남겼다.
