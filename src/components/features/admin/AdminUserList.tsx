/**
 * 관리자 회원 목록 컴포넌트
 */

import { useState } from 'react';
import { Search, MoreVertical, User, Ban, CheckCircle } from 'lucide-react';
import { MOCK_USERS_DATA, type User as UserType } from '@/mocks/users';

type UserStatus = 'active' | 'suspended';

interface AdminUser extends UserType {
  status: UserStatus;
}

// Mock 관리자용 사용자 목록 데이터 - MOCK_USERS_DATA에서 상위 5명 가져옴
const ADMIN_USERS: AdminUser[] = MOCK_USERS_DATA.slice(0, 5).map((u, index) => ({
  ...u,
  status: index % 4 === 0 ? 'suspended' : 'active' // 예시를 위해 일부 정지 처리
}));

const STATUS_LABELS: Record<UserStatus, string> = {
  active: '활성',
  suspended: '정지',
};

const STATUS_COLORS: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
};

const AdminUserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | UserStatus>('all');
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // 필터링된 회원 목록
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 회원 정지/해제
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      {/* 헤더 */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="닉네임 또는 이메일 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 필터 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | UserStatus)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="suspended">정지</option>
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">회원</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">이메일</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">상태</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">가입일</th>
              <th className="text-right text-xs font-medium text-neutral-500 uppercase px-4 py-3">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{user.nickname}</p>
                      <p className="text-xs text-neutral-500">ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-neutral-700">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[user.status]}`}>
                    {STATUS_LABELS[user.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-neutral-500">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>

                    {openMenuId === user.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 z-10">
                        <button
                          onClick={() => window.open(`/shop/${user.id}`, '_blank')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <User className="w-4 h-4" />
                          프로필 보기
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-neutral-50 ${
                            user.status === 'active' ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {user.status === 'active' ? (
                            <>
                              <Ban className="w-4 h-4" />
                              정지하기
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              정지 해제
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

      {/* 결과 없음 */}
      {filteredUsers.length === 0 && (
        <div className="p-8 text-center text-neutral-500">
          검색 결과가 없습니다
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
        <p className="text-sm text-neutral-500">
          총 {filteredUsers.length}명 회원
        </p>
      </div>
    </div>
  );
};

export default AdminUserList;
