# Tailwind CSS v4 마이그레이션 작업 내역

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

## 개요
프로젝트 초기화 과정에서 설치된 Tailwind CSS가 v4(`^4.1.18`)였으나, 설정이 v3 방식으로 되어 있어 호환성 문제가 발생했습니다. 이를 해결하기 위해 v4 표준 아키텍처인 **CSS-first** 방식으로 구성을 완전히 변경했습니다.

## 주요 변경 사항

### 1. 패키지 구성 변경
- **설치**: `@tailwindcss/postcss` (PostCSS 플러그인)
- **설정 변경**: `postcss.config.js`에서 `tailwindcss` 플러그인을 `@tailwindcss/postcss`로 교체

### 2. 설정 아키텍처 변경 (JS Config → CSS Theme)
- **삭제**: `tailwind.config.js` (더 이상 사용하지 않음)
- **이관**: 기존 `tailwind.config.js`의 `theme.extend` 설정을 `src/index.css`의 `@theme` 블록으로 이동

### 3. 코드 변경 상세

#### `src/index.css`
```css
@import "tailwindcss";

@theme {
  /* 디자인 시스템 변수 정의 (Colors, Fonts, Spacing, Shadows...) */
  --color-primary-500: #6667AB;
  /* ... */
}

/* 다크 모드 지원 */
[data-theme="dark"] {
  --color-primary-500: #8A8BD4;
  /* ... */
}

@layer base {
  /* 기본 스타일 */
}
```

## 결과
- `Unknown utility class` 에러 해결
- Tailwind CSS v4 최신 스펙 준수
- 디자인 시스템이 CSS 파일 내에 명시적으로 위치하여 유지보수성 향상
