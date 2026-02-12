/**
 * 프로필 수정 페이지
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Camera from 'lucide-react/dist/esm/icons/camera';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { userService } from '@/services/userService';
import { Navigate } from 'react-router-dom';
import { PasswordChangeModal } from '@/components/features/mypage/PasswordChangeModal';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, isAuthenticated, refreshUser } = useAuthStore();
  
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [intro, setIntro] = useState((user as any)?.intro || '');
  const [avatar] = useState((user as any)?.avatar || '');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = async () => {
    try {
      // 백엔드 UserUpdateRequest가 'name' 필드만 지원하므로 nickname을 name으로 전송합니다.
      // intro(bio)는 현재 백엔드에서 지원하지 않으므로 전송하지 않습니다.
      await userService.updateProfile({ name: nickname });
      await refreshUser();
      showToast('프로필이 수정되었습니다.', 'success');
      navigate('/mypage');
    } catch (error) {
      console.error(error);
      showToast('프로필 수정에 실패했습니다.', 'error');
    }
  };

  const handleCancel = () => {
    navigate('/mypage');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-5 pb-20 min-[360px]:py-6">
      <div className="mx-auto max-w-lg px-3 min-[360px]:px-4">
        {/* 헤더 */}
        <div className="mb-5 flex items-center gap-2 min-[360px]:mb-6 min-[360px]:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">프로필 수정</h1>
        </div>

        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200">
              {avatar ? (
                <img src={avatar} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neutral-400">
                  {nickname.charAt(0)}
                </div>
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-600 transition-colors"
              onClick={() => showToast('이미지 업로드는 목업입니다.', 'info')}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 폼 */}
        <div className="space-y-6">
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="닉네임을 입력하세요"
            />
          </div>

          {/* 소개 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">소개</label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="자기소개를 입력하세요"
            />
          </div>

          {/* 이메일 (읽기 전용) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">이메일</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-neutral-400">이메일은 변경할 수 없습니다.</p>
          </div>

          {/* 계정 보안 - 비밀번호 변경 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">계정 보안</label>
            <Button 
                variant="outline" 
                className="w-full justify-between h-12"
                onClick={() => setShowPasswordModal(true)}
            >
                <span className="text-neutral-700">비밀번호 변경</span>
                <span className="text-neutral-400">→</span>
            </Button>
          </div>

          {/* 휴대폰 (읽기 전용) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">휴대폰</label>
            <input
              type="tel"
              value={(user as any).phone || ''}
              disabled
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-neutral-400">휴대폰 번호 변경은 고객센터에 문의하세요.</p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>

      <PasswordChangeModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  );
};

export default ProfilePage;
