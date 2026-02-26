interface MockDataNoticeProps {
  title?: string;
  message?: string;
}

export function MockDataNotice({
  title = '샘플 데이터 화면',
  message = '백엔드 연동 준비 중이에요. 일부 액션은 "준비 중이에요."로 안내됩니다.',
}: MockDataNoticeProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-sm font-semibold text-amber-800">{title}</p>
      <p className="mt-1 text-xs text-amber-700">{message}</p>
    </div>
  );
}
