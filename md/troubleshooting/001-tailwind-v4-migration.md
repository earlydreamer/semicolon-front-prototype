# [Troubleshooting] Tailwind CSS v4 호환성 이슈

**발생일**: 2026-01-08  
**상태**: 해결됨 (Resolved)  
**분류**: 환경 설정 (Configuration)

## 1. 문제 상황
- **증상**: Vite 개발 서버 실행 시 `[plugin:vite:css] [postcss] It looks like you're trying to use tailwindcss directly as a PostCSS plugin...` 에러 발생
- **원인**: 프로젝트 초기화 시 설치된 `tailwindcss` 버전이 **v4.X**였으나, 설정 파일(`postcss.config.js`, `src/index.css`)은 **v3 방식**으로 구성됨.
    - Tailwind CSS v4부터는 PostCSS 플러그인이 `@tailwindcss/postcss`로 분리됨.
    - CSS 진입점 문법이 `@tailwind base;` 대신 `@import "tailwindcss";`로 변경됨.

## 2. 해결 과정
1. **패키지 설치**: `@tailwindcss/postcss` 설치
   ```bash
   npm install -D @tailwindcss/postcss
   ```
2. **PostCSS 설정 변경**: `postcss.config.js`
   ```javascript
   export default {
     plugins: {
       '@tailwindcss/postcss': {}, // v4 호환 플러그인 사용
       autoprefixer: {},
     },
   }
   ```
3. **CSS 진입점 변경**: `src/index.css`
   ```css
   @import "tailwindcss"; /* v4 문법 */
   
   @layer base { ... }
   ```


## 4. 추가 이슈 및 해결 (2026-01-08)
- **증상**: `src/index.css`에서 `Cannot apply unknown utility class` 에러 발생.
- **원인**: Tailwind CSS v4는 `tailwind.config.js`를 통한 자바스크립트 기반 설정보다 **CSS-first 설정**(`@theme` directives)을 권장함. 기존 설정 파일과 v4의 동작 방식 간 충돌 또는 미인식 문제 발생.
- **해결**:
    1. `tailwind.config.js` 삭제.
    2. `src/index.css`에 `@theme` 블록을 추가하여 디자인 시스템 토큰(색상, 폰트 등)을 직접 정의.
    3. 다크 모드는 CSS 변수 오버라이드 방식(`[data-theme="dark"]`)으로 전환.

## 5. 재발 방지 대책
- `AGENTS.md`에 기술 스택 버전 명시 (Tailwind CSS v4+)
- 새로운 라이브러리 추가 시 최신 문서의 설치 가이드 확인 필수
- **Tailwind v4 사용 시 `tailwind.config.js` 생성 금지**, 모든 설정은 CSS 내에서 처리.
