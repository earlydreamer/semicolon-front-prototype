/**
 * 내 상점 정보 관리 컴포넌트
 */

import { useState } from 'react';
import Camera from 'lucide-react/dist/esm/icons/camera';
import Save from 'lucide-react/dist/esm/icons/save';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useAuthStore } from '@/stores/useAuthStore';
import type { User } from '@/types/auth';

interface ShopInfo {
  name: string;
  intro: string;
  avatar: string;
}

type UserWithProfile = User & {
  intro?: string;
  avatar?: string;
};

const MyShopInfo = () => {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const profileUser = user as UserWithProfile | null;
  const [isEditing, setIsEditing] = useState(false);
  
  const initialShopInfo: ShopInfo = {
    name: user?.nickname || '',
    intro: profileUser?.intro || '',
    avatar: profileUser?.avatar || '',
  };

  const [shopInfo, setShopInfo] = useState<ShopInfo>(initialShopInfo);
  const [editForm, setEditForm] = useState<ShopInfo>(shopInfo);

  const handleEdit = () => {
    setEditForm(shopInfo);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(shopInfo);
  };

  const handleSave = () => {
    setShopInfo(editForm);
    setIsEditing(false);
    showToast('상점 정보가 저장되었습니다', 'success');
  };

  const handleAvatarClick = () => {
    // Mock: 랜덤 아바타 변경
    const avatars = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setEditForm({ ...editForm, avatar: randomAvatar });
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">상점 정보</h2>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            수정
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* 아바타 수정 */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-100">
                <img
                  src={editForm.avatar || 'https://ui-avatars.com/api/?name=Shop&background=random'}
                  alt="상점 아바타"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-500 text-white
                  flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-neutral-500">
              프로필 이미지를 클릭하여 변경
            </div>
          </div>

          {/* 상점명 */}
          <Input
            label="상점명"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="상점명을 입력해주세요"
          />

          {/* 소개 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">상점 소개</label>
            <textarea
              value={editForm.intro}
              onChange={(e) => setEditForm({ ...editForm, intro: e.target.value })}
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-neutral-300 bg-neutral-0 
                text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 resize-y"
              placeholder="상점 소개를 입력해주세요"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              저장
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
            <img
              src={shopInfo.avatar || 'https://ui-avatars.com/api/?name=Shop&background=random'}
              alt="상점 아바타"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">{shopInfo.name}</h3>
            <p className="mt-2 text-sm text-neutral-600 whitespace-pre-wrap">
              {shopInfo.intro || '상점 소개가 없습니다.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShopInfo;
