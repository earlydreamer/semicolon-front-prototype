# 세미콜론 (Semicolon)

> 취미·덕후 특화 중고거래 + 커뮤니티 결합형 플랫폼

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 프로젝트 개요

**세미콜론**은 취미 관련 중고 상품을 찾는 사람들에게 '발품 파는 행위를 줄여주는' 플랫폼입니다.

### 핵심 타깃 카테고리
- 🏕️ 캠핑 장비
- 🎸 악기
- 📷 카메라
- 🎫 공연·티켓
- 💿 앨범·굿즈

### 차별화 요소
- 커뮤니티 기반 신뢰형 거래
- 판매자 상점 중심 UI
- 정산/정산대기/정산가능 명확화
- 배송 API + 거래 추적

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | React 19 |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | TailwindCSS |
| State | Zustand + React Query |
| Routing | React Router v7 |
| HTTP | Axios |
| Form | React Hook Form + Zod |

---

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── assets/           # 정적 리소스
│   ├── components/       # UI 컴포넌트
│   ├── hooks/            # 커스텀 훅
│   ├── pages/            # 페이지 컴포넌트
│   ├── services/         # API 호출 로직
│   ├── stores/           # 전역 상태 관리
│   ├── types/            # TypeScript 타입
│   ├── utils/            # 유틸리티 함수
│   ├── constants/        # 상수 정의
│   ├── mocks/            # Mock 데이터
│   └── styles/           # 글로벌 스타일
├── md/                   # 개발 문서
├── AGENTS.md             # AI 에이전트 개발 지침서
└── rough-plan.md         # 기획 초안
```

---

## 📚 문서

| 문서 | 설명 |
|------|------|
| [AGENTS.md](./AGENTS.md) | AI 에이전트 개발 지침서 |
| [rough-plan.md](./rough-plan.md) | 기획 초안 |
| [md/api-endpoints.md](./md/api-endpoints.md) | API 엔드포인트 정의 |
| [md/naming-conventions.md](./md/naming-conventions.md) | 네이밍 컨벤션 |
| [md/code-structure-guide.md](./md/code-structure-guide.md) | 코드 구조 가이드 |

---

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

---

## 👥 팀 세미콜론

| 영역 | 담당자 |
|------|--------|
| Auth + User | 이태석 |
| Product + ElasticSearch | 오세인 |
| Cart + Order | 문찬희 |
| Payment + Deposit | 박재현 |
| Settlement + ELK | 유승현 |
| Infra | 오세인 |

---

## 📝 라이선스

This project is private.
