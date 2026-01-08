# 프로젝트 초기 셋업

## 개요
- **목적**: React 19 + Vite + TypeScript + TailwindCSS 기반 프로젝트 초기화
- **산출물**: 개발 환경 구성 완료

## 구현 체크리스트

### Phase 1: 프로젝트 초기화
- [x] Vite + React 19 + TypeScript 프로젝트 생성
- [x] TailwindCSS 설치 및 설정
- [x] ESLint + Prettier 설정
- [x] 폴더 구조 생성

### Phase 2: 공통 설정
- [x] 경로 alias 설정 (@/ → src/)
- [x] 환경 변수 설정 (.env)
- [x] 글로벌 스타일 설정
- [x] 색상 팔레트 정의

### Phase 3: 기본 라이브러리 설치
- [x] React Router v7 설치
- [x] Zustand (상태관리) 설치
- [x] React Query (서버상태) 설치
- [x] Axios 설치
- [x] React Hook Form + Zod 설치

### Phase 4: 공통 컴포넌트
- [x] Button 컴포넌트
- [x] Input 컴포넌트
- [ ] Modal 컴포넌트
- [x] Loading 컴포넌트 (Button 내장)
- [ ] Toast/Alert 컴포넌트

## 설치 명령어

```bash
# Vite + React 19 + TypeScript
npm create vite@latest . -- --template react-ts

# TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 필수 라이브러리
npm install react-router-dom@7 zustand @tanstack/react-query axios
npm install react-hook-form zod @hookform/resolvers

# 개발 도구
npm install -D @types/node
npm install -D eslint prettier eslint-plugin-react-hooks
```

## 폴더 구조
```
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   └── features/
├── hooks/
├── pages/
├── services/
├── stores/
├── types/
├── utils/
├── constants/
└── styles/
```

## 주의사항
- React 19 호환성 확인 필요
- TailwindCSS v4 버전 확인
- 환경변수 파일은 .gitignore에 추가

---

> **작성일**: 2026-01-08  
> **상태**: 대기
