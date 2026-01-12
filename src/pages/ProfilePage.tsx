/**
 * 프로필 페이지 (보기/수정 통합)
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera, Edit2, CreditCard, Phone, Mail, Calendar, Coins } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { MOCK_USER } from '@/mocks/users';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isEditMode = searchParams.get('mode') === 'edit';
  
  const [nickname, setNickname] = useState(MOCK_USER.nickname);
  const [intro, setIntro] = useState(MOCK_USER.intro || '');
  const [avatar] = useState(MOCK_USER.avatar);

  const handleSave = () => {
    showToast('프로필이 수정되었습니다.', 'success');
    setSearchParams({});
  };

  const handleCancel = () => {
    setNickname(MOCK_USER.nickname);
    setIntro(MOCK_USER.intro || '');
    setSearchParams({});
  };

  const handleEdit = () => {
    setSearchParams({ mode: 'edit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-lg mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/mypage')}
              className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>
            <h1 className="text-xl font-bold text-neutral-900">
              {isEditMode ? '프로필 수정' : '내 프로필'}
            </h1>
          </div>
          {!isEditMode && (
            <button
              onClick={handleEdit}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <Edit2 className="w-5 h-5 text-neutral-600" />
            </button>
          )}
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
            {isEditMode && (
              <button 
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-600 transition-colors"
                onClick={() => showToast('이미지 업로드는 목업입니다.', 'info')}
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isEditMode ? (
          /* 수정 모드 */
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">소개</label>
              <textarea
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="outline" className="flex-1" onClick={handleCancel}>취소</Button>
              <Button variant="primary" className="flex-1" onClick={handleSave}>저장</Button>
            </div>
          </div>
        ) : (
          /* 보기 모드 */
          <div className="space-y-4">
            {/* 기본 정보 카드 */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200">
              <h2 className="text-sm font-bold text-neutral-500 mb-4">기본 정보</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-neutral-600">{nickname.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">닉네임</p>
                    <p className="font-medium text-neutral-900">{nickname}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">이메일</p>
                    <p className="font-medium text-neutral-900">{MOCK_USER.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">휴대폰</p>
                    <p className="font-medium text-neutral-900">{MOCK_USER.phone || '미등록'}</p>
                  </div>
                </div>
                {intro && (
                  <div className="pt-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-400 mb-1">소개</p>
                    <p className="text-sm text-neutral-700">{intro}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 계정 정보 카드 */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200">
              <h2 className="text-sm font-bold text-neutral-500 mb-4">계정 정보</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">가입일</p>
                    <p className="font-medium text-neutral-900">{formatDate(MOCK_USER.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">보유 포인트</p>
                    <p className="font-medium text-neutral-900">{MOCK_USER.point.toLocaleString()}P</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 정산 계좌 카드 */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-neutral-500">정산 계좌</h2>
                <button
                  onClick={() => navigate('/mypage/settlement')}
                  className="text-xs font-medium text-primary-500 hover:text-primary-600"
                >
                  {MOCK_USER.settlementAccount ? '변경' : '등록'}
                </button>
              </div>
              {MOCK_USER.settlementAccount ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">{MOCK_USER.settlementAccount.bank}</p>
                    <p className="font-medium text-neutral-900">
                      {MOCK_USER.settlementAccount.accountNumber} ({MOCK_USER.settlementAccount.holder})
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700">등록이 필요합니다</p>
                    <p className="text-xs text-orange-500">판매 대금을 받으려면 계좌를 등록하세요</p>
                  </div>
                </div>
              )}
            </div>

            {/* 수정 버튼 */}
            <Button variant="outline" className="w-full mt-4" onClick={handleEdit}>
              프로필 수정
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
