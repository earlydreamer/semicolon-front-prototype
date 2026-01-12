# [기능] 마이페이지 정산 계좌 정보 추가

## 개요
- **목적**: 판매자가 대금을 정산받을 계좌 정보를 등록하고 관리
- **관련 Issue**: #15

## 구현 체크리스트
- [/] 문서 작성: `md/06-mypage/settlement-account-plan.md`
- [ ] Mock 데이터 변경: `src/mocks/users.ts`에 `SettlementAccount` 타입 및 데이터 추가
- [ ] 페이지 구현: `src/pages/SettlementAccountPage.tsx`
- [ ] 네비게이션 추가: `src/components/features/mypage/MyPageNav.tsx`
- [ ] 라우팅 연결: `src/App.tsx`
- [ ] 기능 검증

## 컴포넌트 구조
- SettlementAccountPage
  - Form (Bank Select, Account Number Input, Holder Name Input)
  - Save Button

## 주의사항
- 은행 목록은 상수(`BANKS`)로 정의하여 사용
- 계좌번호는 숫자만 입력 가능하도록 처리
