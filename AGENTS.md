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
| 항목 | 기술 |
|------|------|
| Framework | React 19 |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | TailwindCSS |
| State Management | Zustand / React Query |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Form | React Hook Form + Zod |

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

## 🔄 Git 워크플로우

### 브랜치 전략
```
main          ← 운영 배포
develop       ← 통합 개발
feature/*     ← 기능 개발
hotfix/*      ← 긴급 수정
release/*     ← 릴리즈 준비
```

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 리팩토링
chore: 빌드/환경 설정
docs: 문서 수정
style: 코드 포맷팅
test: 테스트 코드

예시:
feat(product): 카테고리별 필터링 기능 추가
fix(auth): 로그인 토큰 만료 처리 수정
```

### PR 규칙
- 최소 1인 이상 코드 리뷰 필수
- 테스트 통과 필수
- 린트 검사 통과 필수

---

## 📚 문서화 규칙

### md/ 폴더 구조
각 기능별 폴더에 다음 문서 포함:
- `plan.md`: 구현 계획
- `implementation.md`: 구현 상세
- `api.md`: API 연동 명세
- `changelog.md`: 변경 이력

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

### 디자인 원칙
1. **직관적인 네비게이션**: 사용자가 원하는 상품을 3클릭 내 도달
2. **일관된 UI**: 컴포넌트 재사용으로 일관된 경험 제공
3. **모바일 우선**: 반응형 디자인 필수
4. **접근성**: WCAG 2.1 AA 기준 준수

### 색상 팔레트 (예시)
```css
:root {
  --primary: #6366F1;      /* 메인 컬러 */
  --primary-dark: #4F46E5;
  --secondary: #10B981;    /* 보조 컬러 */
  --danger: #EF4444;       /* 경고/삭제 */
  --warning: #F59E0B;      /* 주의 */
  --gray-50: #F9FAFB;
  --gray-900: #111827;
}
```

### 반응형 브레이크포인트
```css
/* TailwindCSS 기본값 사용 */
sm: 640px   /* 모바일 가로 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 소형 데스크톱 */
xl: 1280px  /* 대형 데스크톱 */
2xl: 1536px /* 초대형 */
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

> **마지막 업데이트**: 2026-01-08  
> **버전**: 1.0.0
