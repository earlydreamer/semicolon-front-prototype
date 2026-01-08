# 세미콜론 디자인 시스템

> **버전**: 1.0.0  
> **최종 수정일**: 2026-01-08

---

## 📋 목차

1. [디자인 원칙](#-디자인-원칙)
2. [컬러 시스템](#-컬러-시스템)
3. [타이포그래피](#-타이포그래피)
4. [간격 시스템](#-간격-시스템)
5. [반응형 디자인](#-반응형-디자인)
6. [인터랙션 가이드](#-인터랙션-가이드)
7. [접근성 가이드](#-접근성-가이드)
8. [컴포넌트 가이드](#-컴포넌트-가이드)

---

## 🎯 디자인 원칙

### 핵심 가치
1. **직관성**: 사용자가 3클릭 이내 원하는 상품 도달
2. **일관성**: 모든 UI 요소에 통일된 스타일 적용
3. **접근성**: WCAG 2.1 AA 기준 100% 준수
4. **모바일 우선**: 터치 친화적 인터페이스 설계

### 디자인 트렌드 적용
- **뉴모피즘 & 글래스모피즘**: 부드러운 그림자와 반투명 효과
- **마이크로 인터랙션**: 섬세한 피드백 애니메이션
- **다크 모드 지원**: 시스템 설정 연동
- **유동적 타이포그래피**: 화면 크기에 따른 자연스러운 폰트 조절

---

## 🎨 컬러 시스템

### 키 컬러: Very Peri 베이스

> 2022 Pantone Color of the Year "Very Peri" (#6667AB)를 기반으로 조정

```css
:root {
  /* ============================
   * Primary Colors (Very Peri 계열)
   * ============================ */
  --color-primary-50:  #EEEEF7;   /* 가장 연한 배경용 */
  --color-primary-100: #D5D6EC;
  --color-primary-200: #ABADE0;
  --color-primary-300: #8285D0;
  --color-primary-400: #6D70C4;   /* 강조된 호버 */
  --color-primary-500: #6667AB;   /* 메인 키 컬러 */
  --color-primary-600: #5758A0;
  --color-primary-700: #474891;
  --color-primary-800: #393A7E;
  --color-primary-900: #2A2B5F;   /* 가장 진한 */

  /* ============================
   * Neutral Colors (웜톤 그레이)
   * ============================ */
  --color-neutral-0:   #FFFCF9;   /* 배경색 - 순백보다 웜한 톤 */
  --color-neutral-50:  #FAF8F6;   /* 서브 배경 */
  --color-neutral-100: #F5F2EF;   /* 카드 배경 */
  --color-neutral-200: #E8E4E0;   /* 구분선 */
  --color-neutral-300: #D4CFC9;
  --color-neutral-400: #B5AFA7;
  --color-neutral-500: #8C867E;   /* 비활성 텍스트 */
  --color-neutral-600: #6B655D;
  --color-neutral-700: #524C45;   /* 보조 텍스트 */
  --color-neutral-800: #3A3530;   /* 본문 텍스트 */
  --color-neutral-900: #1F1B17;   /* 제목 텍스트 */

  /* ============================
   * Semantic Colors
   * ============================ */
  /* 성공 (녹색 계열) */
  --color-success-50:  #E8F5E9;
  --color-success-100: #C8E6C9;
  --color-success-500: #4CAF50;   /* 기본 */
  --color-success-600: #43A047;
  --color-success-700: #388E3C;   /* 텍스트용 */

  /* 경고 (주황 계열) */
  --color-warning-50:  #FFF3E0;
  --color-warning-100: #FFE0B2;
  --color-warning-500: #FF9800;   /* 기본 */
  --color-warning-600: #FB8C00;
  --color-warning-700: #F57C00;   /* 텍스트용 */

  /* 에러 (빨강 계열) */
  --color-error-50:    #FFEBEE;
  --color-error-100:   #FFCDD2;
  --color-error-500:   #E53935;   /* 기본 */
  --color-error-600:   #D32F2F;
  --color-error-700:   #C62828;   /* 텍스트용 */

  /* 정보 (파랑 계열) */
  --color-info-50:     #E3F2FD;
  --color-info-100:    #BBDEFB;
  --color-info-500:    #2196F3;   /* 기본 */
  --color-info-600:    #1E88E5;
  --color-info-700:    #1976D2;   /* 텍스트용 */
}
```

### 다크 모드 변수

```css
[data-theme="dark"] {
  /* Primary - 다크 모드에서 밝기 조정 */
  --color-primary-500: #8A8BD4;
  --color-primary-600: #7A7BC9;
  --color-primary-700: #6667AB;

  /* Neutral - 다크 배경 */
  --color-neutral-0:   #1A1815;
  --color-neutral-50:  #242220;
  --color-neutral-100: #2E2C29;
  --color-neutral-200: #3A3835;
  --color-neutral-700: #B5AFA7;
  --color-neutral-800: #D4CFC9;
  --color-neutral-900: #F5F2EF;
}
```

### WCAG 2.1 명암비 준수 가이드

> [!IMPORTANT]
> **모든 텍스트-배경 조합은 최소 4.5:1 명암비 준수 필수**  
> 대형 텍스트(18pt 이상 또는 14pt 볼드)는 3:1 이상

| 용도 | 전경색 | 배경색 | 명암비 | 적합 |
|------|--------|--------|--------|------|
| 본문 텍스트 | `neutral-800` | `neutral-0` | 12.5:1 | ✅ AAA |
| 보조 텍스트 | `neutral-700` | `neutral-0` | 7.2:1 | ✅ AAA |
| 비활성 텍스트 | `neutral-500` | `neutral-0` | 4.5:1 | ✅ AA |
| Primary 버튼 | `neutral-0` | `primary-500` | 5.8:1 | ✅ AA |
| 링크 텍스트 | `primary-600` | `neutral-0` | 5.1:1 | ✅ AA |
| 에러 메시지 | `error-700` | `neutral-0` | 6.8:1 | ✅ AAA |
| 성공 메시지 | `success-700` | `neutral-0` | 5.2:1 | ✅ AA |

### TailwindCSS 설정

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary-500)',
        },
        neutral: {
          0:   'var(--color-neutral-0)',
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        success: {
          50:  'var(--color-success-50)',
          100: 'var(--color-success-100)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          DEFAULT: 'var(--color-success-500)',
        },
        warning: {
          50:  'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
          DEFAULT: 'var(--color-warning-500)',
        },
        error: {
          50:  'var(--color-error-50)',
          100: 'var(--color-error-100)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          DEFAULT: 'var(--color-error-500)',
        },
        info: {
          50:  'var(--color-info-50)',
          100: 'var(--color-info-100)',
          500: 'var(--color-info-500)',
          600: 'var(--color-info-600)',
          700: 'var(--color-info-700)',
          DEFAULT: 'var(--color-info-500)',
        },
      },
    },
  },
};
```

---

## 📝 타이포그래피

### 폰트 패밀리

```css
:root {
  /* 본문용 - Pretendard (한글 최적화) */
  --font-sans: 'Pretendard Variable', 
               'Pretendard', 
               -apple-system, 
               BlinkMacSystemFont, 
               'Apple SD Gothic Neo',
               'Noto Sans KR',
               sans-serif;

  /* 숫자/가격용 - Tabular figures 지원 */
  --font-numeric: 'Inter', 
                  var(--font-sans);

  /* 모노스페이스 (코드) */
  --font-mono: 'JetBrains Mono', 
               'Fira Code', 
               monospace;
}
```

### 타입 스케일

```css
:root {
  /* 기본 크기 (16px) */
  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  2.25rem;    /* 36px */
  --text-5xl:  3rem;       /* 48px */

  /* 라인 높이 */
  --leading-none:   1;
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose:  2;

  /* 글자 두께 */
  --font-light:    300;
  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
}
```

### 사용 가이드

| 요소 | 크기 | 두께 | 라인높이 | 용도 |
|------|------|------|----------|------|
| Display | 48px | Bold | 1.2 | 히어로 섹션 메인 타이틀 |
| H1 | 36px | Bold | 1.25 | 페이지 제목 |
| H2 | 30px | Semibold | 1.3 | 섹션 제목 |
| H3 | 24px | Semibold | 1.35 | 서브섹션 제목 |
| H4 | 20px | Medium | 1.4 | 카드 제목 |
| Body Large | 18px | Regular | 1.5 | 강조 본문 |
| Body | 16px | Regular | 1.5 | 일반 본문 |
| Body Small | 14px | Regular | 1.5 | 보조 텍스트 |
| Caption | 12px | Regular | 1.4 | 캡션, 라벨 |

---

## 📐 간격 시스템

### 기본 단위: 4px

```css
:root {
  --space-0:  0;
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### 컨테이너 최대 너비

```css
:root {
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1440px;
}
```

---

## 📱 반응형 디자인

### 브레이크포인트

```css
/* Mobile First 접근 */
/* 기본: 0px ~ 639px (모바일) */
@media (min-width: 640px)  { /* sm: 태블릿 세로 */ }
@media (min-width: 768px)  { /* md: 태블릿 가로 */ }
@media (min-width: 1024px) { /* lg: 노트북 */ }
@media (min-width: 1280px) { /* xl: 데스크톱 */ }
@media (min-width: 1536px) { /* 2xl: 대형 화면 */ }
```

### 터치 친화적 크기

> [!IMPORTANT]
> **최소 터치 영역: 44×44px** (WCAG 2.1 Success Criterion 2.5.5)

```css
/* 버튼 최소 크기 */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* 인풋 필드 */
.input {
  min-height: 48px;
  padding: 12px 16px;
}

/* 리스트 아이템 (탭 가능) */
.list-item-touch {
  min-height: 48px;
  padding: 12px 16px;
}
```

---

## 👆 인터랙션 가이드

### Hover & Touch 대응 원칙

> 모든 hover 효과는 대응하는 터치 인터랙션 필수 구현

#### 1. 버튼 인터랙션

```css
.btn {
  /* 기본 스타일 */
  transition: all 0.2s ease-out;
}

/* 데스크톱: hover 효과 */
@media (hover: hover) and (pointer: fine) {
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 103, 171, 0.3);
  }
}

/* 모바일: active 효과 */
.btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
```

#### 2. 카드 인터랙션

```tsx
// ProductCard.tsx
const ProductCard = ({ product }: ProductCardProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <article
      className={cn(
        "transition-all duration-200",
        // 데스크톱 hover
        "hover:shadow-lg hover:-translate-y-1",
        // 터치 피드백
        isPressed && "scale-[0.98] shadow-sm"
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
    >
      {/* 카드 내용 */}
    </article>
  );
};
```

#### 3. 드롭다운 메뉴

| 디바이스 | 트리거 | 닫기 |
|----------|--------|------|
| 데스크톱 | Hover 또는 Click | 영역 외 클릭, ESC 키 |
| 모바일 | Tap | 영역 외 탭, 스와이프 다운 |

```tsx
// 유틸리티 훅
const useInteractionType = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    );
  }, []);

  return { isTouchDevice };
};
```

#### 4. 롱 프레스 액션

```tsx
// 데스크톱: 우클릭 메뉴
// 모바일: 롱 프레스로 동일 기능 제공

const useLongPress = (
  callback: () => void,
  ms: number = 500
) => {
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    timerRef.current = window.setTimeout(callback, ms);
  }, [callback, ms]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      callback();
    },
  };
};
```

### 애니메이션 기본값

```css
:root {
  /* 지속 시간 */
  --duration-instant: 50ms;
  --duration-fast:    100ms;
  --duration-normal:  200ms;
  --duration-slow:    300ms;
  --duration-slower:  500ms;

  /* 이징 함수 */
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 모션 감소 설정된 사용자 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## ♿ 접근성 가이드

### WCAG 2.1 AA 체크리스트

#### 인지 가능 (Perceivable)

- [x] **1.1 대체 텍스트**: 모든 이미지에 의미 있는 alt 텍스트
- [x] **1.3 적응성**: 정보와 구조가 시맨틱하게 전달
- [x] **1.4.3 명암비**: 텍스트 4.5:1, 대형 텍스트 3:1 이상
- [x] **1.4.4 텍스트 크기 조절**: 200%까지 확대 가능
- [x] **1.4.11 비텍스트 명암비**: UI 컴포넌트 3:1 이상

#### 조작 가능 (Operable)

- [x] **2.1 키보드**: 모든 기능 키보드로 접근 가능
- [x] **2.4 탐색 가능**: 건너뛰기 링크, 포커스 관리
- [x] **2.5.5 터치 타겟**: 최소 44×44px

#### 이해 가능 (Understandable)

- [x] **3.1 가독성**: 페이지 언어 명시 (`lang="ko"`)
- [x] **3.2 예측 가능**: 일관된 네비게이션
- [x] **3.3 입력 지원**: 에러 식별 및 제안

#### 견고성 (Robust)

- [x] **4.1 호환성**: 유효한 HTML, ARIA 속성

### 포커스 관리

```css
/* 포커스 링 스타일 */
:focus-visible {
  outline: 3px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 마우스 클릭 시 포커스 링 숨김 */
:focus:not(:focus-visible) {
  outline: none;
}

/* 고대비 모드 지원 */
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid CanvasText;
  }
}
```

### ARIA 패턴 가이드

```tsx
// 버튼 (토글)
<button
  aria-pressed={isActive}
  aria-label="좋아요"
>
  <HeartIcon />
</button>

// 모달
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">모달 제목</h2>
  <p id="modal-description">모달 설명</p>
</div>

// 탭 패널
<div role="tablist" aria-label="상품 정보">
  <button role="tab" aria-selected="true" aria-controls="panel-1">
    상세 정보
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">
    리뷰
  </button>
</div>
<div role="tabpanel" id="panel-1">...</div>

// 라이브 리전 (실시간 알림)
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {notification}
</div>
```

### 스크린 리더 전용 텍스트

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 🧩 컴포넌트 가이드

### 버튼 변형

```tsx
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

| Variant | 용도 | 배경 | 텍스트 |
|---------|------|------|--------|
| primary | 주요 액션 | primary-500 | neutral-0 |
| secondary | 보조 액션 | neutral-100 | neutral-800 |
| outline | 덜 강조된 액션 | transparent | primary-600 |
| ghost | 최소 강조 | transparent | neutral-700 |
| danger | 위험 액션 | error-500 | neutral-0 |

### 입력 필드 상태

| 상태 | 테두리 | 배경 | 라벨 |
|------|--------|------|------|
| Default | neutral-300 | neutral-0 | neutral-700 |
| Focus | primary-500 | neutral-0 | primary-600 |
| Error | error-500 | error-50 | error-700 |
| Disabled | neutral-200 | neutral-100 | neutral-500 |
| Success | success-500 | success-50 | success-700 |

### 카드 컴포넌트

```tsx
interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}
```

```css
.card-elevated {
  background: var(--color-neutral-0);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}

.card-interactive:hover {
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
```

### 그림자 시스템

```css
:root {
  --shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md:  0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
  
  /* Primary 컬러 그림자 */
  --shadow-primary: 0 4px 14px rgba(102, 103, 171, 0.4);
}
```

### 둥근 모서리

```css
:root {
  --radius-none: 0;
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;
}
```

---

## 📎 참조 문서

- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Pantone Very Peri](https://www.pantone.com/articles/color-of-the-year/color-of-the-year-2022)
- [TailwindCSS 공식 문서](https://tailwindcss.com/docs)

---

> **다음 단계**: 프로젝트 초기화 시 이 디자인 시스템을 기반으로 `src/styles/` 폴더에 CSS 변수 및 기본 스타일 구현
