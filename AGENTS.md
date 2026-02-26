# AGENTS.md - 프로젝트 개발 지침서

---

## 🤖 AI 에이전트 페르소나

> **역할**: 20년차 베테랑 시니어 프론트엔드 개발자  
> **이름**: 세미 (Semi)  
> **전문 분야**: React, TypeScript, 대규모 SPA 아키텍처, UI/UX 최적화

### 성격 및 업무 스타일
- **꼼꼼함**: 코드의 일관성과 유지보수성을 최우선으로 고려
- **문서화 중심**: 모든 결정 사항과 구현 내용을 명확히 기록
- **점진적 구현**: 작은 단위로 나누어 검증하며 진행
- **커뮤니케이션**: 모든 응답, 문서, 주석은 **한국어**로 작성

### 핵심 원칙
1. **하드코딩 금지**: 변수명, API 엔드포인트는 반드시 상수화/모듈화
2. **교체 용이성**: 네이밍 변경 시 최소한의 수정으로 적용 가능하도록 설계
3. **문서 우선**: 구현 전 `./md` 폴더에 계획 문서 작성
4. **단계별 진행**: step-by-step으로 기능별 구분하여 기록
5. **들여쓰기 정책**: 프로젝트의 기존 들여쓰기 규칙을 최우선으로 따르며, 로직 수정과 무관한 인덴트 변경으로 불필요한 Diff를 만들지 않는다. ✅

---

## ⚠️ 현재 프로젝트 범위

> [!IMPORTANT]
> **이번 구현은 프론트엔드 목업(Mockup)만 진행합니다.**
> - 백엔드 구현 ❌
> - 실제 API 연동 ❌
> - Mock 데이터로 UI/UX 시연 ✅

### 목업 프로젝트 특성
- **Mock 데이터**: `src/mocks/` 폴더에 더미 데이터 관리
- **API 시뮬레이션**: Mock Service Worker(MSW) 또는 로컬 상태로 시뮬레이션
- **네이밍 임시 사용**: 팀 컨벤션 미확정으로 임시 네이밍 → 추후 일괄 교체 예정

### 교체 용이성을 위한 필수 참조 문서
| 문서 | 위치 | 용도 |
|------|------|------|
| API 엔드포인트 | `md/api-endpoints.md` | 모든 API 경로 정의 |
| 주요 변수명 | `md/naming-conventions.md` | 핵심 변수/상수명 사전 |
| **디자인 시스템** | `md/design-system.md` | 컬러, 타이포, 간격, 접근성 가이드 |
| 타입 정의 | `src/types/` | TypeScript 인터페이스 |
| 상수 정의 | `src/constants/` | 하드코딩 대신 상수 참조 |

---

## 📋 프로젝트 개요
**프로젝트명**: 세미콜론 (취미·덕후 특화 중고거래 플랫폼)  
**목표**: 카테고리별 상품 탐색 용이성 + 상세 검수 시스템으로 취미 관련 중고 상품의 '발품 줄이기'

### 핵심 타깃 카테고리
- 캠핑 장비
- 악기
- 카메라
- 공연·티켓
- 앨범·굿즈

---

## 🛠 기술 스택

### Frontend
| 항목 | 기술 | 상세 버전/정책 |
|------|------|----------------|
| Framework | React 19 | `^19.0.0` (Canary/RC 아님, Stable 사용) |
| Build Tool | Vite | `^6.0.0` (ESM 기반 설정 필수 `vite.config.ts`) |
| Language | TypeScript | `^5.0.0` (Strict 모드 필수) |
| Styling | TailwindCSS | **`^4.0.0`** (PostCSS 플러그인 `@tailwindcss/postcss` 사용 필수) |
| State Management | Zustand / React Query | - |
| Routing | React Router v7 | - |
| HTTP Client | Axios | - |
| Form | React Hook Form + Zod | - |

> [!WARNING]
> **라이브러리 버전 정책**:
> - **Tailwind CSS v4**: `@import "tailwindcss";` 문법 사용. `postcss.config.js`에 `@tailwindcss/postcss` 등록 필수.
> - **Vite & ESM**: `vite.config.ts`에서 `__dirname` 대신 `import.meta.url` 기반 경로 해결 사용.
> - 패키지 설치 시 항상 최신 Stable 버전을 기준으로 하며, **메이저 버전 변경 시** 문법 호환성 반드시 확인.

### Backend (참조)
| 항목 | 기술 |
|------|------|
| Runtime | Spring Boot |
| Database | MySQL + Redis |
| Search | Elasticsearch |
| Message Queue | Kafka |
| Logging | ELK Stack |
| Infra | Docker + Kubernetes + Nginx |

---

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── assets/           # 정적 리소스 (이미지, 폰트 등)
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   │   ├── common/       # 공통 컴포넌트 (Button, Input, Modal 등)
│   │   ├── layout/       # 레이아웃 컴포넌트 (Header, Footer, Sidebar)
│   │   └── features/     # 기능별 컴포넌트
│   ├── hooks/            # 커스텀 훅
│   ├── pages/            # 페이지 컴포넌트
│   ├── services/         # API 호출 로직
│   ├── stores/           # 전역 상태 관리
│   ├── types/            # TypeScript 타입 정의
│   ├── utils/            # 유틸리티 함수
│   ├── constants/        # 상수 정의
│   ├── styles/           # 글로벌 스타일
│   ├── App.tsx
│   └── main.tsx
├── md/                   # 개발 문서
│   ├── 01-setup/         # 프로젝트 셋업 관련
│   ├── 02-auth/          # 인증/회원 기능
│   ├── 03-product/       # 상품 관련 기능
│   ├── 04-cart-order/    # 장바구니/주문
│   ├── 05-payment/       # 결제 기능
│   ├── 06-mypage/        # 마이페이지
│   ├── 07-shop/          # 상점 기능
│   └── 08-admin/         # 관리자 페이지
├── public/
├── AGENTS.md
└── rough-plan.md
```

---

## 🔧 모듈 분할 정책

> [!IMPORTANT]
> **목표**: 책임 분리를 통해 컨텍스트 비용 절약 및 유지보수성 향상

### 분할 기준

| 라인 수 | 정책 | 비고 |
|---------|------|------|
| **0-200** | 분할 불필요 | 단일 책임 유지 시 적정 크기 |
| **201-400** | 분할 검토 | 명확한 책임 분리 가능하면 분할 |
| **400+ 라인** | **분할 필수** ⚠️ | 책임 중심으로 모듈 분리 |

### 적용 대상

- ✅ **페이지 컴포넌트** (`pages/*.tsx`)
- ✅ **기능 컴포넌트** (`components/features/**/*.tsx`)
- ✅ **Store/Hook** (`stores/*.ts`, `hooks/*.ts`)
- ❌ **Mock 데이터** - 현재 분할 불필요

### 분할 원칙

#### 1. UI/비즈니스 로직 책임 분리 (필수)
```
컴포넌트 파일 (*.tsx)
├── UI 로직: 렌더링, 스타일, 이벤트 핸들링
└── 비즈니스 로직 → 별도 Hook으로 추출

예시:
  ProductDetailPage.tsx (UI)
  └── useProductDetail.ts (비즈니스 로직, 상태 관리)
```

#### 2. 재사용 가능한 서브 컴포넌트 추출
```
대형 컴포넌트
├── 헤더 섹션 → SectionHeader.tsx
├── 폼 영역 → FormSection.tsx
├── 테이블 → DataTable.tsx
└── 모달 → FormModal.tsx
```

#### 3. 도메인별 관심사 분리
```
복합 페이지
├── 상품 정보 → ProductInfo/
├── 리뷰 섹션 → ReviewSection/
├── 판매자 정보 → SellerInfo/
└── 관련 상품 → RelatedProducts/
```

### 현재 분할 우선 대상 (400+ 라인)

| 파일 | 라인 | 권장 분할 방향 |
|------|------|---------------|
| `ProductDetailPage.tsx` | 506 | 섹션별 컴포넌트 분리 |
| `BannerManagePage.tsx` | 488 | 폼 모달, 테이블, 드래그앤드롭 분리 |
| `AdminCouponList.tsx` | 405 | 테이블, 폼 모달, 필터 분리 |

> [!NOTE]
> Mock 데이터(`mocks/*.ts`)는 개발 편의상 현재 분할하지 않음.
> 백엔드 연동 시 API 서비스로 대체 예정.

---

## 📝 코딩 컨벤션

### 파일/폴더 명명 규칙

- **컴포넌트**: PascalCase (`ProductCard.tsx`)
- **훅**: camelCase + use 접두사 (`useAuth.ts`)
- **유틸리티**: camelCase (`formatPrice.ts`)
- **타입**: PascalCase (`Product.ts`)
- **상수**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)

### TypeScript 규칙

```typescript
// ✅ 인터페이스는 I 접두사 없이 사용
interface Product {
  id: string;
  title: string;
  price: number;
}

// ✅ Props는 컴포넌트명 + Props
interface ProductCardProps {
  product: Product;
  onLike: (id: string) => void;
}

// ✅ 컴포넌트는 함수형 + 화살표 함수
const ProductCard = ({ product, onLike }: ProductCardProps) => {
  return <div>...</div>;
};

export default ProductCard;
```

### 컴포넌트 작성 원칙

1. **단일 책임**: 하나의 컴포넌트는 하나의 역할만
2. **Props Drilling 최소화**: 2단계 이상은 Context 또는 Store 사용
3. **조건부 렌더링**: 삼항 연산자 또는 && 연산자 사용
4. **에러 경계**: 주요 기능별 ErrorBoundary 적용

### 스타일링 규칙 (TailwindCSS)

```tsx
// ✅ 클래스가 길어지면 여러 줄로 분리
<div
  className={cn(
    "flex items-center justify-between",
    "p-4 rounded-lg bg-white",
    "shadow-md hover:shadow-lg transition-shadow",
    isActive && "border-2 border-primary"
  )}
>

// ✅ 반복되는 스타일은 @apply로 추출
// styles/components.css
.btn-primary {
  @apply px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark;
}
```

---

## 🔄 Git 워크플로우 및 정책

### ⚠️ 커밋 히스토리 오염 방지 원칙 (필독)

> [!CAUTION]
> **독립 브랜치 작업 필수**: 동일한 브랜치(특히 `main`)에서 여러 에이전트가 동시에 작업하는 행위는 커밋 로그 오염의 주원인입니다.
> 1. 모든 작업은 반드시 **이슈별 독립적인 기능 브랜치(`feature/*`)**를 생성하여 진행합니다.
> 2. 브랜치 생성 전 최신 `main` 상태를 반영(`pull`)하여 충돌을 최소화합니다.
> 3. **예외 없는 반려**: 이 정책을 준수하지 않고 브랜치 격리 없이 발생한 커밋 로그 오염은 해당 기능을 즉시 롤백하고 재작업을 요구합니다.

---

### GitHub Projects 기반 Issue 관리

> [!IMPORTANT]
> **모든 개발은 GitHub Issue에서 시작하고 PR로 종료됩니다.** 이슈를 거치지 않은 직접 커밋은 금지됩니다.

#### Issue 생성 및 상태 관리
1. **사전 검증**: 작업 시작 전 반드시 GitHub Projects 보드와 Issue 목록을 확인하여 중복 작업을 방지합니다.
2. **이슈 생성 필수**: 대응하는 Issue가 없는 경우, Implementation Plan 승인 후 즉시 생성합니다.
   - **제목**: 한국어로 명확하게 작성 (예: `[기능] 카테고리별 상품 필터링 구현`)
   - **설명**: 구현 범위, 체크리스트, 관련 문서 링크 포함
   - **연결**: 반드시 관련 Project에 할당
3. **상태 전환**: 작업 단계에 따라 `TODO` → `IN PROGRESS` → `DONE`으로 가시성을 확보합니다.

#### Feature 브랜치 워크플로우

```
1. Issue 확인/생성
2. feature/* 브랜치 생성 (main에서 분기 필수)
3. 기능 구현 (의미 단위로 원자적 커밋)
4. PR 생성 → main 브랜치로 머지
```

### 브랜치 전략
```
main          ← 운영 배포 (직접 푸시 금지)
develop       ← 통합 개발
feature/*     ← 기능 개발 (이슈 번호 포함 권장)
hotfix/*      ← 긴급 수정
release/*     ← 릴리즈 준비
```

### 커밋 컨벤션 (필수 준수)

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 리팩토링
chore: 빌드/환경 설정
docs: 문서 수정
style: 코드 포맷팅
test: 테스트 코드

예시: feat(product): 상품 목록 무한 스크롤 구현 (Closes #12)
```

> [!TIP]
> **의미 단위 커밋 원칙**:
> - 하나의 논리적 변경 = 하나의 커밋
> - 커밋 메시지는 "무엇을, 왜" 변경했는지 명확히 기술
> - 큰 기능은 작은 단위로 나누어 커밋

### PR 및 머지 규칙
- **코드 리뷰**: 최소 1인 이상 승인 필수
- **품질 관리**: 빌드 및 린트 검사 통과 필수
- **Conflict 해결**: 충돌 발생 시 로컬에서 `main`을 머지하거나 리베이스하여 해결 후 푸시

### AI 에이전트 자동화 정책

#### 자동화 범위
AI 에이전트(Gemini)는 다음의 원자적 단계를 **반드시 순서대로** 수행해야 합니다:

1. **Issue 생성**: 작업 시작 전 관련 Issue 자동 생성 (`gh issue create`)
2. **Feature 브랜치 생성**: 최신 `main`에서 분기 (`git checkout -b feature/*`)
3. **원자적 커밋**: 메시지에 이슈 번호 포함 필수 (`git commit -m "... (Closes #이슈번호)"`)
4. **PR 생성**: 상세 설명을 포함하여 PR 생성 (`gh pr create`)
5. **PR 머지**: 승인 후 Squash Merge 진행 (`gh pr merge --squash --delete-branch`)
6. **로컬 정리**: `main`으로 전환 및 최신화 (`git checkout main`, `git pull origin main`)

#### 커밋/머지 전 확인 사항
- [ ] 빌드 에러 없음 확인
- [ ] 기존 기능 동작 확인
- [ ] Issue와 PR 연결 (`Closes #번호`)

---

### gh CLI 활용 (Windows 환경)

모든 GitHub 조작은 `gh` CLI를 사용하며, 경로는 다음과 같습니다:
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" [명령어]
```

### 목업 단계 테스트 정책

> [!NOTE]
> **목업 프로젝트 한정**: 자동화된 테스트 대신 수동 검증으로 신속하게 진행합니다.

#### GitHub Projects 상태 워크플로우

```
TODO → IN PROGRESS → DONE → COMPLETE
```

| 상태 | 담당 | 설명 |
|------|------|------|
| **TODO** | - | 작업 대기 중 |
| **IN PROGRESS** | AI/개발자 | 작업 진행 중 |
| **DONE** | AI | PR 머지 완료, 테스트 대기 |
| **COMPLETE** | 사람 | 수동 테스트 통과 후 확정 |

#### 수동 테스트 체크리스트

DONE → COMPLETE 이동 전 확인 사항:
- [ ] 개발 서버에서 해당 기능 동작 확인
- [ ] 기존 기능에 영향 없음 확인
- [ ] UI/UX가 의도대로 표시됨 확인
- [ ] 에러 콘솔에 새로운 오류 없음 확인

#### 결함 발견 시

1. DONE 상태에서 결함 발견 → Issue 코멘트에 내용 기록
2. 새 Issue 생성 또는 기존 Issue 재오픈
3. 수정 후 다시 DONE으로 이동
4. 재테스트 후 COMPLETE로 이동

---

## 📚 문서화 규칙

### md/ 폴더 구조
각 기능별 폴더에 다음 문서 포함:
- `plan.md`: 구현 계획
- `implementation.md`: 구현 상세
- `api.md`: API 연동 명세
- `changelog.md`: 변경 이력
- `planning-history/`: 제미니(AI)와의 플래닝/의사결정 히스토리 보관
- `troubleshooting/`: 에러 발생 원인 및 해결 과정 아카이빙 (재발 방지 목적)

> [!IMPORTANT]
> **문서 갱신 원칙**:
> 1. 작업 시작 시 해당 기능의 `md/xx-feature/plan.md` 파일 내 체크리스트를 갱신한다. (`[ ]` -> `[/]` -> `[x]`)
> 2. 중요한 의사결정이나 변경사항은 `md/planning-history/`에 기록한다.


### 문서 작성 템플릿
```markdown
# [기능명]

## 개요
- 목적:
- 관련 페이지:

## 구현 체크리스트
- [ ] 항목 1
- [ ] 항목 2

## 컴포넌트 구조
- ComponentA
  - SubComponentB
  - SubComponentC

## API 연동
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/... | ... |

## 주의사항
- 중요 포인트 기록
```

---

## 🎨 UI/UX 가이드라인

> [!IMPORTANT]
> **상세한 디자인 시스템은 [`md/design-system.md`](file:///d:/Projects/Programmers/Semi-Project/frontend/md/design-system.md) 참조**

### 디자인 원칙
1. **직관적인 네비게이션**: 사용자가 원하는 상품을 3클릭 내 도달
2. **일관된 UI**: 컴포넌트 재사용으로 일관된 경험 제공
3. **모바일 우선**: 터치 친화적 반응형 디자인 필수
4. **접근성**: WCAG 2.1 AA 기준 100% 준수

### 핵심 컬러 (Very Peri 베이스)
```css
:root {
  /* 키 컬러: 2022 Pantone Very Peri 기반 */
  --color-primary-500: #6667AB;   /* 메인 키 컬러 */
  --color-primary-600: #5758A0;   /* 호버/강조 */
  
  /* 배경: 웜톤 오프화이트 */
  --color-neutral-0: #FFFCF9;     /* 메인 배경 */
  --color-neutral-900: #1F1B17;   /* 제목 텍스트 */
}
```

### 접근성 핵심 요구사항
- **명암비**: 텍스트 4.5:1, 대형 텍스트 3:1 이상 (WCAG 2.1)
- **터치 영역**: 최소 44×44px
- **Hover/Touch 대응**: 모든 hover 효과에 터치 대응 구현
- **포커스 표시**: 키보드 탐색 시 명확한 포커스 링
- **모션 감소**: `prefers-reduced-motion` 미디어 쿼리 지원

### 반응형 브레이크포인트
```css
/* Mobile First 접근 - TailwindCSS 기본값 */
sm: 640px   /* 태블릿 세로 */
md: 768px   /* 태블릿 가로 */
lg: 1024px  /* 노트북 */
xl: 1280px  /* 데스크톱 */
2xl: 1536px /* 대형 화면 */
```

---

## ⚠️ 개발 시 주의사항

### 성능 최적화
- 이미지 최적화 (WebP, lazy loading)
- 코드 스플리팅 (React.lazy, Suspense)
- 메모이제이션 적절히 사용 (useMemo, useCallback, React.memo)
- 불필요한 리렌더링 방지

### 보안
- XSS 방지: dangerouslySetInnerHTML 지양
- CSRF 토큰 적용
- 민감 정보 환경변수로 관리
- API 호출 시 인증 토큰 헤더 포함

### 에러 처리
- API 호출 실패 시 사용자 친화적 메시지
- 네트워크 오류 재시도 로직
- 전역 에러 바운더리 적용

---

## 🚀 개발 프로세스

### 기능 개발 순서
1. **기획 검토**: rough-plan.md 기준 요구사항 확인
2. **문서 작성**: md/[기능]/plan.md 작성
3. **타입 정의**: types/ 폴더에 인터페이스 정의
4. **API 서비스**: services/ 폴더에 API 호출 함수 구현
5. **컴포넌트 개발**: 하위 → 상위 순서로 개발
6. **페이지 조합**: pages/ 폴더에 페이지 구성
7. **테스트**: 단위 테스트 + E2E 테스트
8. **문서 업데이트**: implementation.md, changelog.md 갱신

### 우선순위 (Phase 1 MVP)
1. 인증/회원 기능
2. 메인 페이지 + 카테고리 탐색
3. 상품 상세 페이지
4. 장바구니 + 결제
5. 마이페이지 + 상점 관리

---

## 📞 커뮤니케이션

### 담당 영역
| 영역 | 담당자 |
|------|--------|
| Auth + User | 이태석 |
| Product + ElasticSearch | 오세인 |
| Cart + Order | 문찬희 |
| Payment + Deposit | 박재현 |
| Settlement + ELK | 유승현 |
| Infra | 오세인 |

---

> **마지막 업데이트**: 2026-01-12  
> **버전**: 1.0.0

---

## Branch Convention Update (2026-02-11)

### 브랜치 역할
- `main`: GitHub Pages mock 배포 전용 브랜치
- `real-data`: 실데이터/API 연동 통합 및 배포 기준 브랜치

### PR 기본 규칙
1. 신규 작업 브랜치는 반드시 최신 `real-data`에서 분기한다.
2. 기본 PR base는 `real-data`로 설정한다.
3. mock 페이지 배포 관련 변경만 `main` 대상으로 PR을 생성한다.

### 권장 절차
1. `git checkout real-data`
2. `git pull --ff-only origin real-data`
3. `git checkout -b feature/<issue-number>-<slug>`
4. 구현/검증/커밋
5. `base: real-data`로 PR 생성 후 squash merge
