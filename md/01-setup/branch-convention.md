# Branch Convention

## 목적
- `main` 브랜치를 GitHub Pages 기반 mock 배포용으로 안정적으로 유지한다.
- 실데이터(API 연동) 개발/배포 흐름은 `real-data` 브랜치를 기준으로 운영한다.

## 운영 규칙
1. `main`
- mockup 배포 전용 브랜치
- 실데이터 연동 작업 PR의 base로 사용하지 않는다.

2. `real-data`
- 실데이터/API 연동 기능의 통합 브랜치
- 신규 기능/수정 PR의 기본 base 브랜치로 사용한다.

3. `feature/*`
- 항상 최신 `real-data`에서 분기한다.
- 작업 완료 후 `real-data`로 PR을 생성한다.

## 표준 작업 절차
1. 이슈 생성
2. `git checkout real-data && git pull --ff-only origin real-data`
3. `git checkout -b feature/<issue-number>-<slug>`
4. 구현 및 검증
5. 커밋 (`Closes #<issue-number>` 포함 권장)
6. PR 생성 (`base: real-data`, `head: feature/*`)
7. Squash merge 후 브랜치 삭제
8. 로컬 정리 (`git checkout real-data && git pull --ff-only origin real-data`)

## 예외
- mock 배포 관련 변경만 `main` 대상으로 PR을 생성한다.
- 긴급 수정이 실데이터 서비스에 영향이 있으면 `hotfix/*`를 `real-data` 기준으로 운영한다.

## 시행일
- 2026-02-11
