import Eye from 'lucide-react/dist/esm/icons/eye';
import Pause from 'lucide-react/dist/esm/icons/pause';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import { formatPrice } from '@/utils/formatPrice';
import { SALE_STATUS_LABELS } from '@/constants';
import type { AdminProductListItem } from '@/types/admin';
import type { SaleStatus } from '@/types/product';

const STATUS_COLORS: Record<SaleStatus, string> = {
  ON_SALE: 'bg-green-100 text-green-700',
  RESERVED: 'bg-yellow-100 text-yellow-700',
  SOLD_OUT: 'bg-neutral-100 text-neutral-700',
  BLOCKED: 'bg-red-100 text-red-700',
};

const parseDate = (value: string) => {
  const normalized = value.includes(' ') ? value.replace(' ', 'T') : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

interface AdminProductTableProps {
  products: AdminProductListItem[];
  openMenuId: string | null;
  onToggleMenu: (id: string) => void;
  onCloseMenu: () => void;
  onSuspend: (productUuid: string) => void;
  onDelete: (productUuid: string) => void;
}

export const AdminProductTable = ({
  products,
  openMenuId,
  onToggleMenu,
  onCloseMenu,
  onSuspend,
  onDelete,
}: AdminProductTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">상품</th>
            <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">판매자</th>
            <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">가격</th>
            <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">상태</th>
            <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">등록일</th>
            <th className="text-right text-xs font-medium text-neutral-500 uppercase px-4 py-3">액션</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {products.map((product) => (
            <tr key={product.productUuid} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {product.thumbnailUrl ? (
                    <img
                      src={product.thumbnailUrl}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-neutral-100" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 line-clamp-1">{product.title}</p>
                    <p className="text-xs text-neutral-500">UUID: {product.productUuid}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-neutral-900">{product.sellerNickname || '-'}</td>
              <td className="px-4 py-3 text-sm font-medium text-neutral-900">{formatPrice(product.price)}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[product.saleStatus as SaleStatus] || STATUS_COLORS.ON_SALE}`}
                >
                  {SALE_STATUS_LABELS[product.saleStatus as SaleStatus] || product.saleStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-neutral-500">
                {product.createdAt ? (parseDate(product.createdAt)?.toLocaleDateString('ko-KR') ?? '-') : '-'}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="relative inline-block" data-admin-product-menu>
                  <button
                    type="button"
                    onClick={() => onToggleMenu(product.productUuid)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    aria-label={`${product.title} 관리 메뉴 열기`}
                    aria-haspopup="menu"
                    aria-expanded={openMenuId === product.productUuid}
                  >
                    <MoreVertical className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                  </button>

                  {openMenuId === product.productUuid && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-neutral-200 z-10 animate-in fade-in zoom-in-95 duration-100">
                      <a
                        href={`/products/${product.productUuid}`}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        onClick={onCloseMenu}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <Eye className="w-4 h-4" />
                        상품 보기
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          onCloseMenu();
                          onSuspend(product.productUuid);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-yellow-600 hover:bg-neutral-50"
                      >
                        <Pause className="w-4 h-4" />
                        판매 정지
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onCloseMenu();
                          onDelete(product.productUuid);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-neutral-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
