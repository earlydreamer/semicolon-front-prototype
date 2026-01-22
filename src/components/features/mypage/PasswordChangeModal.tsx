import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/userService';
import { Lock } from 'lucide-react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordChangeModal = ({ isOpen, onClose }: PasswordChangeModalProps) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      showToast('모든 필드값을 입력해주세요.', 'error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast('새 비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    if (formData.newPassword.length < 8) {
      showToast('비밀번호는 8자 이상이어야 합니다.', 'error');
      return;
    }

    setLoading(true);
    try {
      await userService.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      showToast('비밀번호가 성공적으로 변경되었습니다.', 'success');
      onClose();
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      showToast(error.response?.data?.message || '비밀번호 변경에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="비밀번호 변경">
      <div className="space-y-4 p-1">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">현재 비밀번호</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="현재 비밀번호를 입력하세요"
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">새 비밀번호</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="8자 이상의 영문, 숫자 조합"
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">새 비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="새 비밀번호를 한번 더 입력하세요"
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSave} isLoading={loading}>
            변경하기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
