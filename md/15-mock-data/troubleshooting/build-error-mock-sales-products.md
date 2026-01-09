# Mock 데이터 확장 시 빌드 에러

## 발생일시
2026-01-09 17:51

## 증상
`npm run build` 실행 시 TypeScript 컴파일 에러 4개 발생

```
Error: src/mocks/users.ts(144,7): error TS6133: 'SELLER_TO_SHOP' is declared but its value is never read.
Error: src/pages/MyPage.tsx(8,41): error TS2305: Module '"../mocks/users"' has no exported member 'MOCK_SALES_PRODUCTS'.
Error: src/stores/useSellerStore.ts(7,10): error TS2305: Module '"@/mocks/users"' has no exported member 'MOCK_SALES_PRODUCTS'.
Error: src/stores/useSellerStore.ts(67,37): error TS7006: Parameter 'p' implicitly has an 'any' type.
```

## 원인 분석

### 1. `MOCK_SALES_PRODUCTS` 누락
- `users.ts`를 전면 재작성하면서 기존에 존재하던 `MOCK_SALES_PRODUCTS` export를 포함하지 않음
- 기존 코드(`MyPage.tsx`, `useSellerStore.ts`)에서 해당 export를 참조 중이었음

### 2. `SELLER_TO_SHOP` 미사용 경고
- 헬퍼용으로 선언만 해두고 실제 사용하지 않아 TS6133 경고 발생
- `const`로 선언되어 외부에서 참조 불가

## 해결 방법

### 1. `MOCK_SALES_PRODUCTS` 추가
```typescript
// users.ts 끝에 추가
export const MOCK_SALES_PRODUCTS = MOCK_PRODUCTS.filter(p => 
  p.sellerId === 's1' || p.seller.userId === 'u1'
);
```

### 2. `SELLER_TO_SHOP` export 추가
```typescript
// const -> export const
export const SELLER_TO_SHOP: Record<string, string> = { ... };
```

## 교훈

> [!IMPORTANT]
> 기존 파일을 전면 재작성할 때는 **기존 export 목록을 먼저 확인**하고, 
> 다른 파일에서 참조 중인 export가 누락되지 않도록 주의해야 한다.

### 권장 사항
1. 대규모 파일 수정 전 `grep` 등으로 의존성 확인
2. TypeScript 컴파일(`tsc --noEmit`) 후 커밋
3. 미사용 변수는 `export`하거나 명시적으로 제거

## 관련 커밋
```
1f5187e fix(mock): MOCK_SALES_PRODUCTS export 추가 - 빌드 에러 수정
```

---

> **작성일**: 2026-01-09
