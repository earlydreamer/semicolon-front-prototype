import { Button } from '../../common/Button';
import type { Address } from '../../../types/address';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';

interface AddressItemProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  selectable?: boolean;
  onSelect?: (address: Address) => void;
}

export const AddressItem = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = false,
  onSelect
}: AddressItemProps) => {
  return (
    <div className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
      address.isDefault 
        ? 'border-primary-500 bg-primary-50/20 shadow-sm' 
        : 'border-neutral-200 bg-white hover:border-primary-200 hover:shadow-md'
    }`}>
      {/* Status Badges & Action Buttons */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {address.isDefault && (
            <span className="px-2.5 py-1 rounded-lg bg-primary-500 text-white text-[11px] font-black uppercase tracking-tighter">
              기본 배송지
            </span>
          )}
          {address.name && address.name !== '기본 배송지' && (
            <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-500 text-[11px] font-bold">
              {address.name}
            </span>
          )}
          {!address.isDefault && !address.name && (
            <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-500 text-[11px] font-bold">
              배송지
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="h-8 px-3 text-xs font-bold text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
          >
            수정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address.id)}
            className="h-8 px-3 text-xs font-bold text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            삭제
          </Button>
        </div>
      </div>

      {/* Main Content: Recipient Center */}
      <div className="space-y-4">
        <div className="flex items-end gap-3">
          <h4 className="text-xl font-black text-neutral-900 leading-tight">
            {address.recipient}
          </h4>
          <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
            <Phone className="w-3.5 h-3.5" />
            <span className="text-sm font-medium tabular-nums tracking-tight">
              {address.phone || '연락처 없음'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-neutral-50/50 border border-neutral-100">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
          <div className="space-y-1">
            <p className="text-[13px] font-bold text-neutral-400 leading-none">
              {address.zonecode}
            </p>
            <p className="text-sm text-neutral-700 font-medium leading-relaxed">
              {address.address}
            </p>
            <p className="text-sm text-neutral-900 font-bold leading-relaxed">
              {address.detailAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6">
        {selectable ? (
          <Button
            onClick={() => onSelect?.(address)}
            className="w-full font-black h-12 text-sm rounded-xl shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 active:scale-[0.98] transition-all"
          >
            이 배송지로 선택
          </Button>
        ) : (
          !address.isDefault && (
            <Button
              variant="outline"
              onClick={() => onSetDefault(address.id)}
              className="w-full font-bold h-12 text-sm rounded-xl border-neutral-200 text-neutral-500 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              기본 배송지로 설정
            </Button>
          )
        )}
      </div>
    </div>
  );
};
