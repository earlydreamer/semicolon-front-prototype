# 상점 기능

## 개요
- **목적**: 판매자 상점 관리, 상품 등록/관리, 정산 관리
- **담당자**: 유승현 (정산), 공통 (상점)
- **관련 페이지**: 내 상점, 판매자 상점, 상품 관리

## 기능 요구사항

### 판매자 정보 페이지 (공개)
- [ ] 판매자 정보
  - 상점명
  - 누적 판매수
  - 현재 판매수
  - 소개글
  - 판매 상태
- [ ] 팔로우/언팔로우
- [ ] 판매 상품 목록
- [ ] 정렬 (최신/인기/저가/고가)
- [ ] 판매자 후기

### 내 상점 페이지
- [ ] 상점 정보 표시
- [ ] 상점 정보 수정
- [ ] 판매 상품 관리
- [ ] 정산 내역 확인

### 상품 관리
- [ ] 상품 등록
  - 사진 업로드 (다중)
  - 제목 / 가격
  - 상세 설명
  - 상품 상태 (사용감 없음, 잔기스 있음 등)
  - 판매 상태 (판매중/예약중/판매완료)
  - 카테고리 선택
  - 배송비 설정
- [ ] 상품 수정
- [ ] 상품 삭제
- [ ] 상품 상태 변경
- [ ] 필터 (판매중/예약중/판매완료)

### 정산 관리
- [ ] 정산 가능 금액 표시
- [ ] 정산 내역 목록
  - 상품 정보
  - 주문일
  - 확정일
  - 정산일
  - 수수료
- [ ] 필터
  - 정산 완료
  - 정산 가능
  - 정산 대기
- [ ] 정산 요청

## 컴포넌트 구조

```
components/features/shop/
├── ShopHeader.tsx
├── ShopInfo.tsx
├── ShopEditForm.tsx
├── SellerProfile.tsx
├── SellerReviews.tsx
├── ProductManageCard.tsx
├── ProductManageList.tsx
├── ProductForm.tsx
├── ImageUploader.tsx
├── CategorySelector.tsx
├── ProductStatusBadge.tsx
├── SettlementSummary.tsx
├── SettlementTable.tsx
├── SettlementCard.tsx
└── SettlementFilter.tsx

pages/
├── MyShopPage.tsx
├── SellerShopPage.tsx
├── ProductRegisterPage.tsx
├── ProductEditPage.tsx
├── ProductManagePage.tsx
└── SettlementPage.tsx
```

## API 연동 (예상)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/shops/{id} | 상점 정보 |
| PUT | /api/shops/me | 내 상점 수정 |
| GET | /api/shops/{id}/products | 상점 상품 목록 |
| GET | /api/shops/{id}/reviews | 상점 후기 |
| POST | /api/products | 상품 등록 |
| PUT | /api/products/{id} | 상품 수정 |
| DELETE | /api/products/{id} | 상품 삭제 |
| GET | /api/products/mine | 내 상품 목록 |
| GET | /api/settlements | 정산 내역 |
| GET | /api/settlements/available | 정산 가능 금액 |
| POST | /api/settlements/request | 정산 요청 |

## 정산 플로우

```
구매 확정
    ↓
정산 대기 (7일)
    ↓
정산 가능
    ↓
정산 요청
    ↓
정산 완료 (입금)
```

## 정산 상태
- **정산 대기**: 구매 확정 후 정산 대기 기간
- **정산 가능**: 정산 요청 가능 상태
- **정산 완료**: 입금 완료

## 주의사항
- 이미지 업로드 용량 제한 (5MB)
- 이미지 리사이징 처리
- 정산 수수료 명확히 표시
- ELK 연동 로그 기록

---

> **작성일**: 2026-01-08  
> **상태**: 대기
