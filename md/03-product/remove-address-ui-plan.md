# [기능] 주소/위치 정보 UI 및 데이터 제거

## 개요
- 목적: 직거래 미지원으로 인한 사용자 혼란 방지를 위해 주소/위치 정보 UI 제거
- 관련 페이지: 상품 상세, 검색, 메인 페이지 등

## 구현 체크리스트
- [ ] Mock 데이터 (products.ts, users.ts)에서 location 필드 제거
- [ ] Store (useSellerStore.ts)에서 location 관련 로직 제거
- [ ] ProductCard 컴포넌트 위치 정보 UI 제거
- [ ] ProductDetailPage 컴포넌트 위치 정보 UI 제거
- [ ] SearchPage 등 기타 페이지 영향도 확인 및 수정

## 주의사항
- 기존 Mocking 된 데이터 구조가 변경되므로 타입 에러가 발생할 수 있음. 전역적인 수정 필요.
