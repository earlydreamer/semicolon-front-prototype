# 16. 디자인 시스템 업데이트 - 버튼 시인성 개선

## 개요
메인화면 히어로 배너의 "내 물건 팔기" 버튼이 배경색과 구분되지 않는 문제를 해결하기 위해 디자인 시스템의 `outline` 버튼 variant를 개선했습니다.

## 변경 사항

### 수정된 파일
- `src/components/common/Button.tsx`

### 변경 내용

#### outline variant 스타일 변경

| 속성 | 변경 전 | 변경 후 |
|------|---------|---------|
| 테두리 색상 | `border-neutral-200` (연한 회색) | `border-primary-500` (보라색) |
| 배경색 | `bg-transparent` (투명) | `bg-neutral-0` (흰색) |
| 텍스트 색상 | 기본값 | `text-primary-600` |
| 호버 배경 | `hover:bg-neutral-50` | `hover:bg-primary-50` |
| 호버 텍스트 | `hover:text-neutral-900` | `hover:text-primary-700` |

```diff
- variant === 'outline' && "border border-neutral-200 bg-transparent hover:bg-neutral-50 hover:text-neutral-900 active:scale-95"
+ variant === 'outline' && "border border-primary-500 bg-neutral-0 text-primary-600 hover:bg-primary-50 hover:text-primary-700 active:scale-95"
```

## 적용 효과
- 배경색과 명확히 구분되는 보라색 테두리로 버튼의 시인성 향상
- 흰색 배경 적용으로 투명 배경으로 인한 가독성 문제 해결
- 브랜드 색상(primary) 적용으로 디자인 일관성 유지
- 테두리 두께는 기본 `border` (1px)로 유지하여 다른 컴포넌트와 톤앤매너 통일
