/**
 * 팔로우 버튼 컴포넌트
 */

import { UserPlus, UserCheck } from 'lucide-react';
import { useFollowStore } from '../../../stores/useFollowStore';
import { useToast } from '../../common/Toast';

interface FollowButtonProps {
  shopId: string;
  className?: string;
}

const FollowButton = ({ shopId, className = '' }: FollowButtonProps) => {
  const { isFollowing, toggleFollow } = useFollowStore();
  const { showToast } = useToast();
  
  const following = isFollowing(shopId);

  const handleClick = () => {
    const nowFollowing = toggleFollow(shopId);
    showToast(
      nowFollowing ? '상점을 팔로우했습니다' : '팔로우를 취소했습니다',
      nowFollowing ? 'success' : 'info'
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all
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
