/**
 * 프로필 카드 컴포넌트 (확장형)
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../../../mocks/users';
import { Settings, ChevronDown, ChevronUp, Mail, Phone, CreditCard, Calendar, Coins } from 'lucide-react';

interface ProfileCardProps {
  user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* 기본 프로필 영역 */}
      <div className="p-6">
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
                to="/mypage/profile"
                className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
                title="수정"
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

        {/* 상세 정보 토글 버튼 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-1 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          {isExpanded ? (
            <>상세 정보 접기 <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>상세 정보 보기 <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>

      {/* 확장 영역 */}
      {isExpanded && (
        <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4 space-y-4">
          {/* 연락처 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-400">이메일</p>
                <p className="text-sm font-medium text-neutral-900 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-400">휴대폰</p>
                <p className="text-sm font-medium text-neutral-900">{user.phone || '미등록'}</p>
              </div>
            </div>
          </div>

          {/* 계정 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-400">가입일</p>
                <p className="text-sm font-medium text-neutral-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Coins className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-400">포인트</p>
                <p className="text-sm font-medium text-neutral-900">{user.point.toLocaleString()}P</p>
              </div>
            </div>
          </div>

          {/* 정산 계좌 */}
          <div className="pt-3 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-500">정산 계좌</span>
              <Link
                to="/mypage/settlement"
                className="text-xs font-medium text-primary-500 hover:text-primary-600"
              >
                {user.settlementAccount ? '변경' : '등록'}
              </Link>
            </div>
            {user.settlementAccount ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">{user.settlementAccount.bank}</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {user.settlementAccount.accountNumber} ({user.settlementAccount.holder})
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-sm font-medium text-orange-600">등록이 필요합니다</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 프로필 수정 버튼 */}
      <div className="border-t border-neutral-100 px-6 py-3">
        <Link
          to="/mypage/profile"
          className="block w-full py-2.5 text-center text-sm font-medium text-neutral-700
                     bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
        >
          프로필 수정
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
