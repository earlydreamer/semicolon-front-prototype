import Search from 'lucide-react/dist/esm/icons/search';
import User from 'lucide-react/dist/esm/icons/user';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { EmptyState } from '@/components/common/EmptyState';

const AdminUserList = () => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      <div className="p-4 border-b border-neutral-200 space-y-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" aria-hidden="true" />
            <p>
              관리자 회원 목록/검색 API가 없어 실데이터 목록을 제공할 수 없습니다.
              제재/복구 API는 userUuid 입력형으로만 제공됩니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="admin-user-search" className="sr-only">
              닉네임 또는 이메일 검색
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
            <input
              id="admin-user-search"
              type="search"
              placeholder="회원 목록 API 미구현"
              disabled
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-400 cursor-not-allowed"
            />
          </div>

          <label htmlFor="admin-user-status-filter" className="sr-only">
            회원 상태 필터
          </label>
          <select
            id="admin-user-status-filter"
            disabled
            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-400 cursor-not-allowed"
          >
            <option>전체 상태</option>
          </select>
        </div>
      </div>

      <EmptyState
        icon={User}
        title="회원 목록 API 미구현"
        description="백엔드에 관리자 회원 목록 조회 엔드포인트가 없어 이 화면은 읽기 전용 안내 상태입니다."
      />
    </div>
  );
};

export default AdminUserList;
