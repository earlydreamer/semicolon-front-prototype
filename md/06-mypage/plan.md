# 마이페이지 기능

## 개요
- **목적**: 개인 정보 관리, 거래 내역, 좋아요 상품 관리
- **관련 페이지**: 마이페이지, 프로필 수정, 거래내역

## 기능 요구사항

### 내 정보 ✅ (UI 구현 완료)

- [x] 프로필 정보 표시
- [ ] 프로필 수정
  - 닉네임
  - 프로필 이미지
  - 소개글
- [ ] 비밀번호 변경
- [ ] 회원 탈퇴

### 주소 관리

- [ ] 배송지 목록
- [ ] 배송지 추가
- [ ] 배송지 수정
- [ ] 배송지 삭제
- [ ] 기본 배송지 설정

### 포인트 관리

- [x] 포인트 잔액 (표시만)
- [ ] 포인트 내역
  - 적립 내역
  - 사용 내역

### 판매 기록 ✅ (UI 구현 완료)

- [x] 판매중 상품
- [x] 예약중 상품
- [x] 판매 완료 상품
- [x] 탭 전환

### 거래 내역 (구매) ✅ (UI 구현 완료)

- [x] 주문 목록
- [ ] 주문 상세
  - 주문 상태 / order_id / 결제 일시
  - 상품 정보
  - 금액 정보 (상품/할인/최종)
  - 배송지 / 결제수단 / 배송상태
- [ ] 구매 확정
- [ ] 주문 취소
- [ ] 리뷰 작성

### 좋아요 상품 ✅ (UI 구현 완료)

- [x] 좋아요 목록
- [x] 좋아요 취소
- [ ] 판매 완료 상품 알림

### 팔로잉

- [ ] 팔로잉 목록
- [ ] 팔로잉 상점 이동
- [ ] 언팔로우

## 컴포넌트 구조

```
components/features/mypage/
├── ProfileCard.tsx
├── ProfileEditForm.tsx
├── PasswordChangeForm.tsx
├── AddressList.tsx
├── AddressCard.tsx
├── AddressForm.tsx
├── PointSummary.tsx
├── PointHistory.tsx
├── SalesTabs.tsx
├── SalesProductCard.tsx
├── OrderCard.tsx
├── OrderDetail.tsx
├── LikedProductList.tsx
├── FollowingList.tsx
└── FollowingCard.tsx

pages/
├── MyPage.tsx
├── ProfileEditPage.tsx
├── AddressManagePage.tsx
├── PointPage.tsx
├── SalesHistoryPage.tsx
├── OrderHistoryPage.tsx
├── LikedProductsPage.tsx
└── FollowingPage.tsx
```

## API 연동 (예상)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/users/me | 내 정보 |
| PUT | /api/users/me | 내 정보 수정 |
| PUT | /api/users/me/password | 비밀번호 변경 |
| DELETE | /api/users/me | 회원 탈퇴 |
| GET | /api/users/addresses | 배송지 목록 |
| POST | /api/users/addresses | 배송지 추가 |
| PUT | /api/users/addresses/{id} | 배송지 수정 |
| DELETE | /api/users/addresses/{id} | 배송지 삭제 |
| GET | /api/users/points | 포인트 조회 |
| GET | /api/users/points/history | 포인트 내역 |
| GET | /api/users/sales | 판매 내역 |
| GET | /api/orders | 구매 내역 |
| GET | /api/users/likes | 좋아요 목록 |
| GET | /api/users/following | 팔로잉 목록 |

## 주의사항
- 민감 정보 마스킹 처리
- 비밀번호 변경 시 현재 비밀번호 확인
- 주소 API (우편번호 서비스) 연동

---

> **작성일**: 2026-01-08  
> **상태**: 대기
