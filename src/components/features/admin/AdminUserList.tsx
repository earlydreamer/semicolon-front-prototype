
import Search from 'lucide-react/dist/esm/icons/search';
import User from 'lucide-react/dist/esm/icons/user';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import Ban from 'lucide-react/dist/esm/icons/ban';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { Button } from '@/components/common/Button';
import { useAdminUsers, type UserFilterStatus } from '@/hooks/admin/useAdminUsers';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  WITHDRAWN_PENDING: 'bg-yellow-100 text-yellow-700',
  WITHDRAWN_FINAL: 'bg-neutral-100 text-neutral-700',
  DELETED: 'bg-red-100 text-red-700',
  SANCTIONED: 'bg-red-100 text-red-700'
};

export const AdminUserList = () => {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    users,
    totalCount,
    totalPages,
    currentPage,
    setCurrentPage,
    openMenuId,
    isLoading,
    errorMessage,
    loadUsers,
    toggleMenu,
    closeMenu,
  } = useAdminUsers();

  const handleToggleStatus = () => {
    alert('회원 제재/복구 기능은 아직 API가 완벽히 구성되지 않아 안내 팝업으로 대체합니다.');
    closeMenu();
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-neutral-200 space-y-3 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="admin-user-search" className="sr-only">
              닉네임 또는 이메일 검색
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
            <input
              id="admin-user-search"
              type="search"
              placeholder="닉네임 또는 이메일 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
            />
          </div>

          <label htmlFor="admin-user-status-filter" className="sr-only">
            회원 상태 필터
          </label>
          <select
            id="admin-user-status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as UserFilterStatus)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white transition-shadow"
          >
            <option value="all">전체 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="WITHDRAWN_PENDING">탈퇴 대기</option>
            <option value="DELETED">삭제됨</option>
            <option value="SANCTIONED">제재됨</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-neutral-500" role="status" aria-live="polite">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent mb-2" />
          <p>회원 목록을 불러오는 중이에요…</p>
        </div>
      ) : errorMessage ? (
        <div className="p-12 text-center space-y-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
          <Button variant="outline" onClick={() => void loadUsers()}>
            다시 시도
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">회원</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">이메일</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">권한</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">상태</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">가입일</th>
                  <th className="text-right text-xs font-medium text-neutral-500 uppercase px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((user) => (
                  <tr key={user.userUuid} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{user.nickname}</p>
                          <p className="text-xs text-neutral-500 truncate max-w-[120px]" title={user.userUuid}>
                            {user.userUuid}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-700">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.role === 'ADMIN' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[user.status] || 'bg-neutral-100'}`}>
                        {user.statusLabel || user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block" data-admin-user-menu>
                        <button
                          onClick={() => toggleMenu(user.userUuid)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-500" />
                        </button>

                        {openMenuId === user.userUuid && (
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 z-10">
                            <button
                              onClick={() => window.open(`/shop/${user.userUuid}`, '_blank')}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            >
                              <User className="w-4 h-4" />
                              프로필 보기
                            </button>
                            <button
                              onClick={() => handleToggleStatus()}
                              className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-neutral-50 ${user.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'
                                }`}
                            >
                              {user.status === 'ACTIVE' ? (
                                <>
                                  <Ban className="w-4 h-4" />
                                  정지/제재
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  해제
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 text-sm">
              검색 결과가 없습니다.
            </div>
          ) : null}

          <div className="p-4 border-t border-neutral-200 flex justify-between items-center bg-neutral-50/50">
            <p className="text-sm text-neutral-500 font-medium">
              총 {new Intl.NumberFormat('ko-KR').format(totalCount)}명 회원
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p: number) => Math.max(0, p - 1))}
                disabled={currentPage === 0 || isLoading}
                className="p-1 rounded hover:bg-neutral-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm px-2 py-1">{currentPage + 1} / {totalPages || 1}</span>
              <button
                onClick={() => setCurrentPage((p: number) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1 || isLoading}
                className="p-1 rounded hover:bg-neutral-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserList;
