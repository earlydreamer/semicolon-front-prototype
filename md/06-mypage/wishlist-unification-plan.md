# [기능] 마이페이지 찜한 상품 기능 수정 및 워딩 통일

## 개요
- **목적**: 앱 내 "좋아요 상품" 워딩을 "찜한 상품"으로 통일하고, 비어있던 찜한 상품 페이지 데이터 복구
- **관련 Issue**: #16

## 구현 체크리스트
- [x] 구현 계획 승인 및 브랜치 생성 (`feature/wishlist-unification`)
- [/] 문서 작성: `md/06-mypage/wishlist-unification-plan.md`
- [ ] Mock 데이터 및 Store 수정: `src/stores/useLikeStore.ts` (ID: `1` -> `p1` 등 유효한 ID로 변경)
- [ ] 워딩 수정: `src/pages/LikedProductsPage.tsx` ("좋아요 상품" -> "찜한 상품")
- [ ] 워딩 수정: `src/components/features/mypage/MyPageNav.tsx` ("좋아요 상품" -> "찜한 상품")
- [ ] 워딩 수정: `src/pages/MyPage.tsx` (주석 및 텍스트)
- [ ] 전수 조사: `grep`을 통한 잔여 "좋아요 상품" 텍스트 확인
- [ ] 기능 검증 및 PR 생성

## 주의사항
- "관심 상품", "찜", "찜한 상품" 중 "찜한 상품"으로 용어 통일
- `useLikeStore`의 초기 데이터가 실제 `MOCK_PRODUCTS`에 존재하는 ID여야 함
