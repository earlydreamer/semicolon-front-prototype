# 고객지원 페이지 구현 계획

## 개요
- **목적**: 푸터 누락 페이지 생성 및 링크 정상화
- **관련 페이지**: `/notice`, `/faq`, `/policy`, `/seller`

## 구현 체크리스트
- [ ] `./src/pages/NoticePage.tsx` 생성
- [ ] `./src/pages/FaqPage.tsx` 생성
- [ ] `./src/pages/PolicyPage.tsx` 생성
- [ ] `./src/App.tsx` 라우트 등록
- [ ] `./src/components/layout/Footer.tsx` 링크 수정

## 컴포넌트 구조
- `NoticePage`: `NoticeList` -> `NoticeItem`
- `FaqPage`: `FaqList` -> `Accordion`
- `PolicyPage`: `Tab` (이용약관/개인정보) -> `Content`

## 주의사항
- 디자인 시스템의 `Very Peri` 컬러 사용
- 모바일 우선 대응 (Mobile First)
- WCAG 2.1 AA 명암비 준수
