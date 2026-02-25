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
  const [intro, setIntro] = useState(user?.intro || '');
  const [avatar] = useState(user?.avatar || '');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = async () => {
    try {
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
      <div className="mx-auto max-w-2xl px-3 min-[360px]:px-4">
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

        <div className="grid grid-cols-1 gap-8">
          {/* 기본 정보 구역 */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">기본 정보</h2>
            
            {/* 프로필 이미지 */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200">
                  {avatar ? (
                    <img src={avatar} alt="프로필" width={96} height={96} className="w-full h-full object-cover" />
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

            <div className="space-y-6">
              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
                  placeholder="자기소개를 입력하세요"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">이메일</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-neutral-100 rounded-xl bg-neutral-50 text-neutral-400 cursor-not-allowed"
                  />
                </div>

                {/* 계정 보안 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">계정 보안</label>
                  <Button 
                      variant="outline" 
                      className="w-full justify-between h-12 border-neutral-200"
                      onClick={() => setShowPasswordModal(true)}
                  >
                      <span className="text-neutral-700">비밀번호 변경</span>
                      <span className="text-neutral-400">→</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" className="flex-1" onClick={handleCancel}>
                취소
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleSave}>
                저장
              </Button>
            </div>
          </div>
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
