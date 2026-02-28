import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { EmptyState } from '@/components/common/EmptyState';

export function AdminReportList() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" aria-hidden="true" />
          <p>
            신고 관리 API(목록/처리/반려)가 아직 구현되지 않았습니다.
            실데이터 연동 전까지 이 화면은 안내 전용으로 제공합니다.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <EmptyState
          icon={AlertTriangle}
          title="신고 API 미구현"
          description="백엔드 신고 엔드포인트가 추가되면 목록/상세/처리 기능을 연결할 수 있습니다."
        />
      </div>
    </div>
  );
}
