# [기능] 푸터 누락 페이지 생성 및 라우팅 연결

## 개요
- **목적**: 푸터에 링크된 공지사항, FAQ, 이용약관 페이지를 생성하고 라우팅을 연결하여 사용자 편의성 증대
- **관련 Issue**: #17 (추정)

## 구현 체크리스트
- [x] 구현 계획 작성 및 브랜치 생성 (`feature/footer-pages`)
- [/] 문서 작성: `md/06-mypage/footer-links-plan.md`
- [ ] 페이지 컴포넌트 생성: `NoticePage.tsx`
- [ ] 페이지 컴포넌트 생성: `FAQPage.tsx`
- [ ] 페이지 컴포넌트 생성: `PolicyPage.tsx`
- [ ] 라우팅 연결: `App.tsx` (notice, faq, policy, categories redirect)
- [ ] 링크 수정: `Footer.tsx` (내 상점: `/shop` -> `/seller`)
- [ ] 최종 검증 및 PR 생성

## 주의사항
- 정적 텍스트 중심의 페이지이므로 UI 가독성 위주로 구현
- `/categories` 접근 시 사용자 경험을 위해 홈으로 리다이렉트하거나 검색 페이지로 유도
