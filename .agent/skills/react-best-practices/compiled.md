# React Best Practices - 전체 가이드

**Version 1.0.0**  
원본: Vercel Engineering  
조정: Semi Project Team (Vite/React 환경)  
최종 수정: 2026-01-17

> **Note:**  
> 이 문서는 AI 에이전트가 React 코드베이스를 유지보수, 생성, 리팩토링할 때 따라야 할 가이드라인.
> Next.js 특화 기능은 Vite/React 환경에 맞게 조정됨.

---

## 목차

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
3. [Client-Side Data Fetching](#3-client-side-data-fetching) — **MEDIUM-HIGH**
4. [Re-render Optimization](#4-re-render-optimization) — **MEDIUM**
5. [Rendering Performance](#5-rendering-performance) — **MEDIUM**
6. [JavaScript Performance](#6-javascript-performance) — **LOW-MEDIUM**
7. [Advanced Patterns](#7-advanced-patterns) — **LOW**

---

## 1. Eliminating Waterfalls

**영향도: CRITICAL**

Waterfall은 성능 저하의 #1 원인. 각 순차적 await는 전체 네트워크 지연 시간을 추가함. 이를 제거하면 가장 큰 성능 향상을 얻을 수 있음.

### 1.1 필요할 때만 Await 지연

**영향도: HIGH (사용되지 않는 코드 경로 차단 방지)**

`await` 작업을 실제로 필요한 분기로 이동하여 불필요한 코드 경로 차단을 피함.

**❌ 잘못된 예: 두 분기 모두 차단**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  
  if (skipProcessing) {
    // userData를 기다렸지만 즉시 반환
    return { skipped: true }
  }
  
  // 이 분기만 userData 사용
  return processUserData(userData)
}
```

**✅ 올바른 예: 필요할 때만 차단**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // 기다리지 않고 즉시 반환
    return { skipped: true }
  }
  
  // 필요할 때만 fetch
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

### 1.2 독립적인 작업에 Promise.all() 사용

**영향도: CRITICAL (2-10배 개선)**

비동기 작업에 상호 의존성이 없으면 `Promise.all()`로 동시 실행.

**❌ 잘못된 예: 순차 실행, 3번의 왕복**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**✅ 올바른 예: 병렬 실행, 1번의 왕복**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### 1.3 부분 의존성에 대한 병렬화

**영향도: CRITICAL (2-10배 개선)**

일부 작업에만 의존성이 있는 경우, 의존성 없는 작업은 먼저 시작.

**❌ 잘못된 예: profile이 config를 불필요하게 기다림**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**✅ 올바른 예: config와 profile이 병렬 실행**

```typescript
const userPromise = fetchUser()
const configPromise = fetchConfig()

const user = await userPromise
const [config, profile] = await Promise.all([
  configPromise,
  fetchProfile(user.id)
])
```

---

## 2. Bundle Size Optimization

**영향도: CRITICAL**

초기 번들 크기를 줄이면 Time to Interactive와 Largest Contentful Paint가 개선됨.

### 2.1 배럴 파일 Import 피하기

**영향도: CRITICAL (200-800ms import 비용, 빌드 느려짐)**

배럴 파일 대신 소스 파일에서 직접 import하여 수천 개의 사용되지 않는 모듈 로드 방지.

**배럴 파일**: 여러 모듈을 re-export하는 진입점 (예: `export * from './module'`을 하는 `index.js`)

인기 있는 아이콘/컴포넌트 라이브러리는 진입 파일에 **최대 10,000개의 re-export**가 있을 수 있음.
많은 React 패키지에서 **import하는 데만 200-800ms**가 소요됨.

**❌ 잘못된 예: 전체 라이브러리 import**

```tsx
import { Check, X, Menu } from 'lucide-react'
// 1,583개 모듈 로드, dev에서 ~2.8s 추가
// 런타임 비용: 매 cold start마다 200-800ms

import { Button, TextField } from '@mui/material'
// 2,225개 모듈 로드, dev에서 ~4.2s 추가
```

**✅ 올바른 예: 필요한 것만 import**

```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
// 3개 모듈만 로드 (~2KB vs ~1MB)

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// 사용하는 것만 로드
```

**영향받는 라이브러리**: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`

### 2.2 무거운 컴포넌트에 Dynamic Import

**영향도: CRITICAL (TTI와 LCP에 직접 영향)**

`React.lazy()`를 사용하여 초기 렌더에 필요 없는 큰 컴포넌트를 lazy-load.

**❌ 잘못된 예: Monaco가 메인 청크에 포함 (~300KB)**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**✅ 올바른 예: Monaco를 on-demand 로드**

```tsx
import { lazy, Suspense } from 'react'

const MonacoEditor = lazy(() => import('./monaco-editor'))

function CodePanel({ code }: { code: string }) {
  return (
    <Suspense fallback={<div>에디터 로딩 중...</div>}>
      <MonacoEditor value={code} />
    </Suspense>
  )
}
```

### 2.3 조건부 모듈 로딩

**영향도: HIGH (필요할 때만 큰 데이터 로드)**

기능이 활성화될 때만 큰 데이터나 모듈을 로드.

```tsx
function AnimationPlayer({ enabled }: { enabled: boolean }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames) {
      import('./animation-frames.js')
        .then(mod => setFrames(mod.frames))
        .catch(console.error)
    }
  }, [enabled, frames])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}
```

### 2.4 사용자 의도 기반 프리로드

**영향도: MEDIUM (체감 지연 감소)**

필요하기 전에 무거운 번들을 프리로드하여 체감 지연 감소.

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    void import('./monaco-editor')
  }

  return (
    <button
      onMouseEnter={preload}
      onFocus={preload}
      onClick={onClick}
    >
      에디터 열기
    </button>
  )
}
```

---

## 3. Client-Side Data Fetching

**영향도: MEDIUM-HIGH**

자동 중복 제거와 효율적인 데이터 페칭 패턴으로 불필요한 네트워크 요청 감소.

### 3.1 SWR/React Query로 자동 중복 제거

**영향도: MEDIUM-HIGH (중복 요청 자동 제거)**

SWR 또는 React Query를 사용하면 같은 키에 대한 여러 hook 호출이 자동으로 중복 제거됨.

**❌ 잘못된 예: 매 마운트마다 fetch**

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])
  
  return <div>{user?.name}</div>
}
```

**✅ 올바른 예: 자동 캐싱 및 중복 제거**

```tsx
import useSWR from 'swr'

function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useSWR(`/api/users/${userId}`, fetcher)
  return <div>{user?.name}</div>
}
```

### 3.2 전역 이벤트 리스너 중복 제거

**영향도: MEDIUM (메모리 누수 및 중복 처리 방지)**

여러 컴포넌트에서 동일한 전역 이벤트를 구독할 때 중복 제거.

```tsx
// 🔧 utils/useWindowResize.ts
const listeners = new Set<() => void>()

function handleResize() {
  listeners.forEach(fn => fn())
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize)
}

export function useWindowResize(callback: () => void) {
  useEffect(() => {
    listeners.add(callback)
    return () => { listeners.delete(callback) }
  }, [callback])
}
```

### 3.3 localStorage 데이터 버전 관리

**영향도: LOW-MEDIUM (데이터 마이그레이션 문제 방지)**

localStorage에 저장되는 데이터에 버전을 추가하여 스키마 변경 시 마이그레이션 가능.

```typescript
interface StoredData {
  version: number
  data: UserPreferences
}

const CURRENT_VERSION = 2

export function loadPreferences(): UserPreferences {
  const raw = localStorage.getItem('preferences')
  if (!raw) return DEFAULT_PREFERENCES
  
  const stored: StoredData = JSON.parse(raw)
  
  if (stored.version < CURRENT_VERSION) {
    return migratePreferences(stored.data, stored.version)
  }
  
  return stored.data
}
```

---

## 4. Re-render Optimization

**영향도: MEDIUM**

불필요한 리렌더를 줄여 낭비되는 연산을 최소화하고 UI 반응성 향상.

### 4.1 상태 읽기를 사용 시점으로 지연

**영향도: MEDIUM (불필요한 구독 방지)**

콜백 내에서만 읽는 동적 상태(searchParams, localStorage)를 구독하지 않음.

**❌ 잘못된 예: 모든 searchParams 변경에 구독**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>공유</button>
}
```

**✅ 올바른 예: on-demand 읽기, 구독 없음**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>공유</button>
}
```

### 4.2 메모이즈된 컴포넌트로 추출

**영향도: MEDIUM (연산 전 early return 가능)**

비용이 큰 작업을 메모이즈된 컴포넌트로 추출하여 early return 가능.

**❌ 잘못된 예: loading 중에도 avatar 계산**

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

**✅ 올바른 예: loading 시 계산 건너뜀**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

> **Note:** React Compiler가 활성화된 프로젝트에서는 `memo()`와 `useMemo()`를 수동으로 사용할 필요 없음. 컴파일러가 자동으로 최적화함.

### 4.3 Effect 의존성 좁히기

**영향도: LOW (effect 재실행 최소화)**

객체 대신 primitive 의존성을 지정하여 effect 재실행 최소화.

**❌ 잘못된 예: user의 모든 필드 변경 시 재실행**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**✅ 올바른 예: id 변경 시에만 재실행**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

### 4.4 Derived State 구독

**영향도: MEDIUM (리렌더 빈도 감소)**

연속적인 값 대신 derived boolean 상태를 구독하여 리렌더 빈도 감소.

**❌ 잘못된 예: 매 픽셀 변경마다 리렌더**

```tsx
function Sidebar() {
  const width = useWindowWidth()  // 지속적으로 업데이트
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**✅ 올바른 예: boolean 변경 시에만 리렌더**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

### 4.5 함수형 setState 사용

**영향도: LOW (안정적인 콜백)**

안정적인 콜백을 위해 함수형 setState 업데이트 사용.

```tsx
// ❌ 잘못된 예: count 변경마다 새 콜백
const increment = useCallback(() => {
  setCount(count + 1)
}, [count])

// ✅ 올바른 예: 안정적인 콜백
const increment = useCallback(() => {
  setCount(prev => prev + 1)
}, [])
```

### 4.6 Lazy 상태 초기화

**영향도: LOW (비용이 큰 초기화 방지)**

비용이 큰 초기값에는 함수를 전달.

```tsx
// ❌ 잘못된 예: 매 렌더마다 parseData 실행
const [data, setData] = useState(parseData(rawData))

// ✅ 올바른 예: 초기 렌더에만 parseData 실행
const [data, setData] = useState(() => parseData(rawData))
```

### 4.7 Non-Urgent 업데이트에 Transition 사용

**영향도: MEDIUM (UI 반응성 유지)**

긴급하지 않은 업데이트에 `startTransition` 사용.

```tsx
import { startTransition } from 'react'

function Search({ onSearch }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)  // 즉시 업데이트 (긴급)
    
    startTransition(() => {
      setResults(searchItems(value))  // 나중에 업데이트 (비긴급)
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      <Results items={results} />
    </>
  )
}
```

---

## 5. Rendering Performance

**영향도: MEDIUM**

렌더링 프로세스를 최적화하여 브라우저가 해야 할 작업 감소.

### 5.1 긴 리스트에 CSS content-visibility

**영향도: MEDIUM (오프스크린 콘텐츠 렌더링 건너뜀)**

`content-visibility: auto`를 사용하여 뷰포트 밖의 콘텐츠 렌더링 지연.

```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px; /* 예상 높이 */
}
```

```tsx
function LongList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} className="list-item">
          <ExpensiveItem data={item} />
        </li>
      ))}
    </ul>
  )
}
```

### 5.2 정적 JSX 요소 호이스팅

**영향도: LOW (재생성 방지)**

정적 JSX를 컴포넌트 외부로 추출하여 재생성 방지.

**❌ 잘못된 예: 매 렌더마다 새 객체 생성**

```tsx
function Form() {
  return (
    <form>
      <label>이름</label>
      <input />
      <button type="submit">제출</button>
    </form>
  )
}
```

**✅ 올바른 예: 정적 요소 재사용**

```tsx
const SUBMIT_BUTTON = <button type="submit">제출</button>

function Form() {
  return (
    <form>
      <label>이름</label>
      <input />
      {SUBMIT_BUTTON}
    </form>
  )
}
```

> **Note:** React Compiler가 활성화되면 이 최적화는 자동으로 수행됨.

### 5.3 명시적 조건부 렌더링

**영향도: LOW (0이나 NaN 렌더링 방지)**

조건이 `0`, `NaN`, 또는 다른 falsy 값이 될 수 있을 때 `&&` 대신 삼항 연산자 사용.

**❌ 잘못된 예: count가 0일 때 "0" 렌더링**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// count = 0일 때 렌더링: <div>0</div>
```

**✅ 올바른 예: count가 0일 때 아무것도 렌더링하지 않음**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// count = 0일 때 렌더링: <div></div>
```

---

## 6. JavaScript Performance

**영향도: LOW-MEDIUM**

핫 경로에 대한 마이크로 최적화. 누적되면 의미 있는 개선이 될 수 있음.

### 6.1 DOM CSS 변경 일괄 처리

**영향도: LOW (reflow 최소화)**

CSS 변경을 클래스나 cssText로 그룹화.

**❌ 잘못된 예: 여러 번의 style 접근**

```typescript
element.style.width = '100px'
element.style.height = '100px'
element.style.margin = '10px'
```

**✅ 올바른 예: 한 번에 변경**

```typescript
element.style.cssText = 'width: 100px; height: 100px; margin: 10px;'
// 또는
element.className = 'sized-element'
```

### 6.2 반복 조회용 Index Map 구축

**영향도: MEDIUM (O(n) → O(1) 조회)**

반복 조회가 필요할 때 Map 인덱스 구축.

**❌ 잘못된 예: 매번 find (O(n))**

```typescript
function getUserName(userId: string) {
  return users.find(u => u.id === userId)?.name
}
```

**✅ 올바른 예: Map으로 O(1) 조회**

```typescript
const userMap = new Map(users.map(u => [u.id, u]))

function getUserName(userId: string) {
  return userMap.get(userId)?.name
}
```

### 6.3 여러 배열 반복 결합

**영향도: LOW (반복 횟수 감소)**

여러 filter/map을 하나의 루프로 결합.

**❌ 잘못된 예: 3번 반복**

```typescript
const activeUsers = users
  .filter(u => u.active)
  .map(u => u.name)
  .filter(name => name.length > 2)
```

**✅ 올바른 예: 1번 반복**

```typescript
const activeUsers: string[] = []
for (const u of users) {
  if (u.active && u.name.length > 2) {
    activeUsers.push(u.name)
  }
}
```

### 6.4 O(1) 조회용 Set/Map 사용

**영향도: MEDIUM (includes를 has로 대체)**

배열의 `includes()`를 Set의 `has()`로 대체.

**❌ 잘못된 예: O(n) 조회**

```typescript
const allowedIds = ['a', 'b', 'c', 'd', 'e']

function isAllowed(id: string) {
  return allowedIds.includes(id)
}
```

**✅ 올바른 예: O(1) 조회**

```typescript
const allowedIds = new Set(['a', 'b', 'c', 'd', 'e'])

function isAllowed(id: string) {
  return allowedIds.has(id)
}
```

### 6.5 Early Return

**영향도: LOW (불필요한 연산 방지)**

함수에서 조기에 반환하여 불필요한 연산 방지.

```typescript
function processOrder(order: Order) {
  if (!order) return null
  if (order.status === 'cancelled') return null
  if (!order.items.length) return null
  
  // 비용이 큰 처리는 여기서만 실행
  return calculateTotal(order)
}
```

### 6.6 루프 외부로 RegExp 호이스팅

**영향도: LOW (RegExp 재생성 방지)**

루프 내에서 RegExp 생성 방지.

**❌ 잘못된 예: 매 반복마다 RegExp 생성**

```typescript
for (const item of items) {
  if (/pattern/.test(item)) {
    // ...
  }
}
```

**✅ 올바른 예: 한 번만 생성**

```typescript
const pattern = /pattern/

for (const item of items) {
  if (pattern.test(item)) {
    // ...
  }
}
```

### 6.7 불변성을 위해 toSorted() 사용

**영향도: LOW (원본 배열 유지)**

`sort()` 대신 `toSorted()`로 원본 배열 유지.

```typescript
// ❌ 원본 배열 변경
const sorted = items.sort((a, b) => a.value - b.value)

// ✅ 새 배열 반환, 원본 유지
const sorted = items.toSorted((a, b) => a.value - b.value)
```

---

## 7. Advanced Patterns

**영향도: LOW**

특정 상황에서 신중하게 구현해야 하는 고급 패턴.

### 7.1 Ref에 이벤트 핸들러 저장

**영향도: LOW (안정적인 핸들러 참조)**

effect cleanup에서 사용되는 핸들러를 ref에 저장.

```tsx
function useEventListener(
  event: string,
  handler: (e: Event) => void
) {
  const handlerRef = useRef(handler)
  
  // 항상 최신 핸들러 참조
  useLayoutEffect(() => {
    handlerRef.current = handler
  })
  
  useEffect(() => {
    const listener = (e: Event) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}
```

### 7.2 useLatest로 안정적인 콜백 참조

**영향도: LOW (의존성 배열 단순화)**

항상 최신 값을 참조하는 ref를 반환하는 hook.

```tsx
function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

// 사용 예
function Component({ onSubmit }: { onSubmit: () => void }) {
  const onSubmitRef = useLatest(onSubmit)
  
  useEffect(() => {
    const handler = () => onSubmitRef.current()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, []) // onSubmit이 의존성에 없어도 항상 최신 참조
}
```

---

## 참고 자료

- [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills)
- [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [React Compiler](https://react.dev/learn/react-compiler)
- [better-all](https://github.com/shuding/better-all)
