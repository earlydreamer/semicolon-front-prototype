# 022-branch-strategy-real-data

## 배경
- `main` 브랜치는 GitHub Pages mock 배포용으로 사용 중이다.
- 실데이터 연동 작업이 `main`에 들어가면 mock 배포 안정성이 깨진다.

## 결정
- 실데이터/API 연동 작업의 PR base 브랜치를 `main`에서 `real-data`로 전환한다.
- `main`은 mock 배포 브랜치로만 유지한다.

## 이유
- mock 배포와 실데이터 배포 경로를 분리해 운영 리스크를 낮춘다.
- 브랜치 역할을 명확히 하여 협업 시 실수를 줄인다.

## 적용 규칙
1. 모든 신규 기능 브랜치는 최신 `real-data`에서 분기
2. 기본 PR target은 `real-data`
3. mock 배포 관련 변경만 `main` 대상으로 PR 생성

## 영향
- 실데이터 관련 PR/머지 히스토리는 `real-data`에 집중된다.
- `main`은 데모/목업 환경 검증에만 사용한다.

## 시행일
- 2026-02-11
