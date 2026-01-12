# GEMINI.md - AI 에이전트 작업 가이드 (v1.1)

이 문서는 AI 에이전트(Gemini)가 본 프로젝트에서 작업을 수행할 때 반드시 준수해야 하는 **절대적인 기술 워크플로우**를 정의합니다. `AGENTS.md`의 내용을 기반으로 하되, 에이전트의 자동화 도구(`gh` CLI) 사용법을 구체화합니다.

---

## 🚨 제미니의 5대 금칙 (Never Ever)
1. **이슈 없는 코드 수정 금지**: 사소한 오타 수정이라도 이슈가 생성되거나 연결되어야 함.
2. **단독 Branch 작업 금지**: 모든 작업은 `main`에서 분기된 `feature/*` 브랜치에서 수행.
3. **거대 커밋 금지**: "의미 단위"로 나누어 최소 2~3개 이상의 커밋으로 분할 권장.
4. **이슈 상태 누락 금지**: 작업의 시작(In Progress)과 끝(Complete)은 반드시 GitHub 이슈 상태에 반영.
5. **계획 단계 건너뛰기 금지**: `notify_user`를 통한 사용자 승인 없이 코드 수정을 시작하지 말 것.

---

## 🛠 표준 작업 절차 (SOC)

### 1. 초기 분석 & 이슈 생성
작업 시작 전 `gh issue list`로 기존 이슈를 확인하고, 없으면 생성합니다.
```powershell
# 이슈 생성 예시
& "C:\Program Files\GitHub CLI\gh.exe" issue create --title "[유형] 작업명" --body "## 개요`n- 목적:`n- 체크리스트:`n  - [ ] 작업1"
```

### 2. 브랜치 전략
생성된 이슈 번호(예: #18)를 사용하여 브랜치를 생성합니다.
```powershell
git checkout -b feature/issue-18-workflow-guidelines
```

### 3. 계획 수립 (Planning)
`implementation_plan.md`를 작성하고 이슈 번호를 명시한 뒤 `notify_user`로 승인받습니다.

### 4. 구현 및 원자적 커밋 (Execution)
의미 단위로 원자적 커밋을 수행합니다.
```powershell
git add .
git commit -m "feat(guideline): GEMINI.md 지침 강화" -m "Closes #18"
```

### 5. 검증 및 PR (Verification)
`walkthrough.md`를 작성하고 PR을 생성하여 머지합니다.
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" pr create --title "PR 제목" --body "Closes #18" --base main
& "C:\Program Files\GitHub CLI\gh.exe" pr merge --squash --delete-branch
```

---

## ⚠️ 지침 위반 시 대응
워크플로우를 생략하고 작업을 진행한 경우, 에이전트는 즉시 작업을 중단하고 **이전 상태로 롤백**한 뒤 이슈 생성부터 다시 시작해야 합니다. 이는 사용자의 명시적 요청보다 우선하는 프로젝트 설계 원칙입니다.
