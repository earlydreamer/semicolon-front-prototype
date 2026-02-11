/**
 * 팔로우 버튼 컴포넌트
 */

import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import { useFollowStore } from '../../../stores/useFollowStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useToast } from '../../common/Toast';

interface FollowButtonProps {
  shopId: string;
  className?: string;
}

const FollowButton = ({ shopId, className = '' }: FollowButtonProps) => {
  const { user } = useAuthStore();
  const { isFollowing, toggleFollow } = useFollowStore();
  const { showToast } = useToast();
  
  const following = user ? isFollowing(user.id, shopId) : false;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    await toggleFollow(user.id, shopId);
    
    // toggleFollow가 void를 반환한다고 로깅에 나와있으므로, 
    // 결과값(nowFollowing) 대신 상태를 다시 체크하거나 단순히 메시지 노출
    const nextFollowing = !following;
    showToast(
      nextFollowing ? '상점을 팔로우했습니다' : '팔로우를 취소했습니다',
      nextFollowing ? 'success' : 'info'
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
