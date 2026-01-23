/**
 * 프로필 카드 컴포넌트 (기본 프로필 정보)
 */

import { Link } from 'react-router-dom';
import type { User } from '../../../mocks/users';
import { Mail, Calendar } from 'lucide-react';

interface ProfileCardProps {
  user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      {/* 프로필 헤더 */}
      <div className="flex items-start gap-4 mb-6">
        {/* 아바타 */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-neutral-400">
              {user.nickname.charAt(0)}
            </div>
          )}
        </div>

        {/* 닉네임 & 소개 */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-neutral-900 mb-1">{user.nickname}</h2>
          {user.intro && (
            <p className="text-sm text-neutral-600 line-clamp-2">{user.intro}</p>
          )}
        </div>

        {/* 수정 버튼 */}
        <Link
          to="/mypage/profile"
          className="px-3 py-1.5 text-xs font-medium text-primary-500 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0"
        >
          수정
        </Link>
      </div>

      {/* 연락처 & 가입일 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-neutral-400">이메일</p>
            <p className="text-sm font-medium text-neutral-900 truncate">{user.email}</p>
          </div>
        </div>



        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-neutral-400">가입일</p>
            <p className="text-sm font-medium text-neutral-900">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
