/**
 * 프로필 카드 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { User } from '../../../mocks/users';
import { Settings } from 'lucide-react';

interface ProfileCardProps {
  user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200">
      <div className="flex items-start gap-4">
        {/* 아바타 */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-neutral-400">
              {user.nickname.charAt(0)}
            </div>
          )}
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-neutral-900">{user.nickname}</h2>
            <Link
              to="/mypage/settings"
              className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              title="설정"
            >
              <Settings className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>
          <p className="text-sm text-neutral-500 mb-2">{user.email}</p>
          {user.intro && (
            <p className="text-sm text-neutral-700 line-clamp-2">{user.intro}</p>
          )}
        </div>
      </div>

      {/* 프로필 수정 버튼 */}
      <Link
        to="/mypage/profile/edit"
        className="mt-4 block w-full py-2.5 text-center text-sm font-medium text-neutral-700
                   bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
      >
        프로필 수정
      </Link>
    </div>
  );
};

export default ProfileCard;
