/**
 * 팔로우 버튼 컴포넌트
 */

import { useEffect } from 'react';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import { useFollowStore } from '../../../stores/useFollowStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useToast } from '../../common/Toast';

interface FollowButtonProps {
  sellerUuid: string;
  className?: string;
}

const FollowButton = ({ sellerUuid, className = '' }: FollowButtonProps) => {
  const { user } = useAuthStore();
  const { isFollowing, toggleFollow, initFollowing } = useFollowStore();
  const { showToast } = useToast();
  
  const following = user ? isFollowing(user.id, sellerUuid) : false;

  useEffect(() => {
    if (!user) {
      return;
    }
    initFollowing(user.id);
  }, [user, initFollowing]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    try {
      const nextFollowing = await toggleFollow(user.id, sellerUuid);
      showToast(
        nextFollowing ? '상점을 팔로우했어요' : '팔로우를 취소했어요',
        nextFollowing ? 'success' : 'info'
      );
    } catch {
      showToast('팔로우 처리에 실패했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors
        ${following
          ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          : 'bg-primary-500 text-white hover:bg-primary-600'
        } ${className}`}
    >
      {following ? (
        <>
          <UserCheck className="w-4 h-4" />
          팔로잉
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          팔로우
        </>
      )}
    </button>
  );
};

export default FollowButton;
