---
name: react-best-practices
description: |
  React 성능 최적화 가이드라인. React 컴포넌트 작성, 리뷰, 리팩토링 시 최적의 성능 패턴을 보장하기 위해 사용.
  트리거: React 컴포넌트, 데이터 페칭, 번들 최적화, 성능 개선 관련 작업 시 적용.
  원본: Vercel Labs agent-skills (https://github.com/vercel-labs/agent-skills)
license: MIT
metadata:
  author: Vercel Engineering (adapted for Vite/React by Antigravity)
  version: "1.1.0"
  last_updated: "2026-01-17"
  environment: "Vite + React 19 + TypeScript"
---

# React Best Practices for Antigravity

> **AI 에이전트 지침**: 이 스킬은 React 코드 작성, 리뷰, 리팩토링 시 자동으로 적용됨.
> 아래 트리거 조건에 해당하면 체크리스트와 패턴을 따를 것.

---

## 🎯 트리거 조건

다음 상황에서 이 스킬을 **반드시** 적용:

| 트리거 | 적용 규칙 |
|--------|-----------|
| `async/await` 작성 | → [Waterfall 제거](#1-waterfall-제거-critical) |
| `import` 문 작성 | → [Barrel Import 피하기](#21-barrel-import-피하기) |
| 새 컴포넌트 생성 | → [리렌더 최적화](#3-리렌더-최적화-medium) |
| `useEffect` 작성 | → [Effect 의존성 좁히기](#32-effect-의존성-좁히기) |
| 데이터 페칭 구현 | → [SWR/React Query 사용](#4-데이터-페칭-medium-high) |
| 배열 처리 로직 | → [JS 성능 최적화](#5-javascript-성능-low-medium) |

---

## ✅ 코드 작성 체크리스트

### 새 컴포넌트 작성 시

```
□ import가 배럴 파일 대신 직접 경로를 사용하는가?
□ 무거운 컴포넌트는 React.lazy()로 분리했는가?
□ 조건부 렌더링에 && 대신 삼항 연산자를 사용했는가?
□ 정적 JSX 요소는 컴포넌트 외부로 호이스팅했는가?
```

### 비동기 로직 작성 시

```
□ 독립적인 Promise들은 Promise.all()로 병렬 실행하는가?
□ await는 실제 필요한 분기에서만 사용하는가?
□ early return으로 불필요한 await를 피하는가?
```

### 상태/Effect 작성 시

```
□ useState 초기값이 비용이 크면 함수 형태로 전달했는가?
□ useEffect 의존성이 객체가 아닌 primitive인가?
□ 콜백에서만 사용되는 상태를 구독하고 있지 않은가?
□ 함수형 setState (prev => ...) 를 사용하는가?
```

---

## 1. Waterfall 제거 (CRITICAL)

### 1.1 Promise.all() 사용

순차적 await는 성능의 #1 킬러. 독립적인 작업은 병렬로 실행.

```typescript
// ❌ BAD: 3번의 순차 왕복
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// ✅ GOOD: 1번의 병렬 왕복
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### 1.2 필요한 분기에서만 Await

```typescript
// ❌ BAD: 항상 userData를 기다림
async function handleRequest(userId: string, skip: boolean) {
  const userData = await fetchUserData(userId)
  if (skip) return { skipped: true }
  return processUserData(userData)
}

// ✅ GOOD: 필요할 때만 기다림
async function handleRequest(userId: string, skip: boolean) {
  if (skip) return { skipped: true }
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

---

## 2. 번들 최적화 (CRITICAL)

### 2.1 Barrel Import 피하기

```typescript
// ❌ BAD: 전체 라이브러리 로드 (1,583개 모듈, 200-800ms)
import { Check, X, Menu } from 'lucide-react'

// ✅ GOOD: 필요한 것만 로드 (3개 모듈, ~2KB)
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
```

**영향받는 라이브러리**: `lucide-react`, `@mui/material`, `react-icons`, `date-fns`, `lodash`

### 2.2 React.lazy() 사용

```tsx
// ❌ BAD: 메인 번들에 포함
import { HeavyEditor } from './HeavyEditor'

// ✅ GOOD: 필요할 때 로드
import { lazy, Suspense } from 'react'
const HeavyEditor = lazy(() => import('./HeavyEditor'))

function App() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <HeavyEditor />
    </Suspense>
  )
}
```

### 2.3 Hover/Focus 프리로드

```tsx
function EditorButton({ onClick }: Props) {
  const preload = () => void import('./HeavyEditor')

  return (
    <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      에디터 열기
    </button>
  )
}
```

---

## 3. 리렌더 최적화 (MEDIUM)

### 3.1 함수형 setState

```typescript
// ❌ BAD: count 변경마다 새 콜백
const increment = useCallback(() => setCount(count + 1), [count])

// ✅ GOOD: 안정적인 콜백
const increment = useCallback(() => setCount(prev => prev + 1), [])
```

### 3.2 Effect 의존성 좁히기

```typescript
// ❌ BAD: user 객체의 모든 필드 변경 시 재실행
useEffect(() => {
  console.log(user.id)
}, [user])

// ✅ GOOD: id 변경 시에만 재실행
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

### 3.3 Lazy 상태 초기화

```typescript
// ❌ BAD: 매 렌더마다 parseData 실행
const [data, setData] = useState(parseData(rawData))

// ✅ GOOD: 초기 렌더에만 실행
const [data, setData] = useState(() => parseData(rawData))
```

### 3.4 Derived State 구독

```tsx
// ❌ BAD: 매 픽셀 변경마다 리렌더
function Sidebar() {
  const width = useWindowWidth()  // 지속 업데이트
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}

// ✅ GOOD: boolean 변경 시에만 리렌더
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

---

## 4. 데이터 페칭 (MEDIUM-HIGH)

### 4.1 SWR/React Query 사용

```tsx
// ❌ BAD: 매 마운트마다 fetch
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])
  return <div>{user?.name}</div>
}

// ✅ GOOD: 자동 캐싱 및 중복 제거
import useSWR from 'swr'

function UserProfile({ userId }: Props) {
  const { data: user } = useSWR(`/api/users/${userId}`, fetcher)
  return <div>{user?.name}</div>
}
```

---

## 5. JavaScript 성능 (LOW-MEDIUM)

### 5.1 Set/Map으로 O(1) 조회

```typescript
// ❌ BAD: O(n) 조회
const allowedIds = ['a', 'b', 'c', 'd', 'e']
const isAllowed = (id: string) => allowedIds.includes(id)

// ✅ GOOD: O(1) 조회
const allowedIds = new Set(['a', 'b', 'c', 'd', 'e'])
const isAllowed = (id: string) => allowedIds.has(id)
```

### 5.2 반복 조회용 Map 인덱스

```typescript
// ❌ BAD: 매번 find (O(n))
function getUserName(userId: string) {
  return users.find(u => u.id === userId)?.name
}

// ✅ GOOD: Map으로 O(1) 조회
const userMap = new Map(users.map(u => [u.id, u]))
function getUserName(userId: string) {
  return userMap.get(userId)?.name
}
```

### 5.3 배열 반복 결합

```typescript
// ❌ BAD: 3번 반복
const result = items
  .filter(u => u.active)
  .map(u => u.name)
  .filter(name => name.length > 2)

// ✅ GOOD: 1번 반복
const result: string[] = []
for (const u of items) {
  if (u.active && u.name.length > 2) {
    result.push(u.name)
  }
}
```

---

## 6. 렌더링 최적화 (MEDIUM)

### 6.1 명시적 조건부 렌더링

```tsx
// ❌ BAD: count=0 일 때 "0" 렌더링
{count && <span className="badge">{count}</span>}

// ✅ GOOD: count=0 일 때 아무것도 렌더링 안 함
{count > 0 ? <span className="badge">{count}</span> : null}
```

### 6.2 정적 JSX 호이스팅

```tsx
// ✅ 컴포넌트 외부에 정적 요소 정의
const SUBMIT_BUTTON = <button type="submit">제출</button>

function Form() {
  return (
    <form>
      <input />
      {SUBMIT_BUTTON}
    </form>
  )
}
```

### 6.3 긴 리스트에 content-visibility

```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px; /* 예상 높이 */
}
```

---

## 🚫 이 프로젝트에서 제외된 패턴

> **Note**: Vite 기반 CSR 프로젝트이므로 다음은 적용 불가

- ❌ `next/dynamic` → 대신 `React.lazy()` 사용
- ❌ Server Components (RSC)
- ❌ Server Actions
- ❌ `React.cache()` (서버 전용)
- ❌ `after()` for non-blocking operations
- ❌ Hydration 관련 패턴

---

## 📚 전체 규칙 참조

상세한 설명이 필요한 경우 [compiled.md](./compiled.md) 참조.
