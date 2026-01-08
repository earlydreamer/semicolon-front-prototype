# 프로젝트 초기화 계획 (Project Initialization Plan)

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

목표: React 19 + Vite + TypeScript 기반의 프로젝트 스캐폴딩을 완성하고, `AGENTS.md`에 정의된 구조와 기술 스택을 적용합니다.

## User Review Required
> [!IMPORTANT]
> 현재 디렉토리에 마크다운 파일들이 존재하므로, `vite` 초기화 시 충돌이 발생할 수 있습니다.
> `npm create vite@latest . -- --template react-ts` 명령어를 사용할 예정이며, 기존 파일은 유지됩니다.

## Proposed Changes

### Project Setup
#### [NEW] [package.json](file:///d:/Projects/Programmers/Semi-Project/frontend/package.json)
- React 19, ReactDOM 19
- Vite
- TypeScript
- Dependencies:
    - `react-router-dom` (v7)
    - `zustand`, `react-query`
    - `axios`
    - `react-hook-form`, `zod`
    - `clsx`, `tailwind-merge`
    - `lucide-react`

#### [NEW] [vite.config.ts](file:///d:/Projects/Programmers/Semi-Project/frontend/vite.config.ts)
- Alias 설정 (`@/*` -> `./src/*`)

#### [NEW] [tsconfig.json](file:///d:/Projects/Programmers/Semi-Project/frontend/tsconfig.json)
- Base URL 및 Paths 설정

### Styling
#### [NEW] [tailwind.config.js](file:///d:/Projects/Programmers/Semi-Project/frontend/tailwind.config.js)
- `md/design-system.md`의 컬러 팔레트, 폰트, 스페이싱 등 설정 파일로 이관

#### [NEW] [src/index.css](file:///d:/Projects/Programmers/Semi-Project/frontend/src/index.css)
- Tailwind Directives 및 Base styles (`@layer base`)

### Directory Structure
#### [NEW] `src/` hierarchy
- `AGENTS.md`에 정의된 폴더 구조 생성
    - `assets/`, `components/`, `hooks/`, `pages/`, `services/`, `stores/`, `types/`, `utils/`, `constants/`, `styles/`

## Verification Plan
### Automated Tests
- `npm run dev` 실행 후 브라우저에서 기본 페이지 렌더링 확인
- Tailwind 스타일 적용 확인 (배경색 변경 등)
- Alias 경로 import 동작 확인

### Manual Verification
- 폴더 구조가 `AGENTS.md`와 일치하는지 확인
