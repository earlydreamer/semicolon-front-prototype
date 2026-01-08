/**
 * 장바구니 페이지
 */

import { useCartStore } from '../stores/useCartStore';
import { useToast } from '../components/common/Toast';
import CartList from '../components/features/cart/CartList';
import CartSummary from '../components/features/cart/CartSummary';

const CartPage = () => {
  const { showToast } = useToast();
  
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const toggleSelect = useCartStore((state) => state.toggleSelect);
  const selectAll = useCartStore((state) => state.selectAll);
  const removeSelectedItems = useCartStore((state) => state.removeSelectedItems);
  const getCartSummary = useCartStore((state) => state.getCartSummary);

  const summary = getCartSummary();
  const allSelected = items.length > 0 && items.every((item) => item.selected);
  const hasSelectedItems = items.some((item) => item.selected);

  // 선택 삭제 핸들러
  const handleRemoveSelected = () => {
    if (!hasSelectedItems) {
      showToast('삭제할 상품을 선택해주세요', 'error');
      return;
    }
    
    const selectedCount = items.filter((i) => i.selected).length;
    removeSelectedItems();
    showToast(`${selectedCount}개 상품이 삭제되었습니다`, 'success');
  };

  // 주문하기 핸들러 (placeholder)
  const handleOrder = () => {
    // TODO: 주문 페이지로 이동
    console.log('Order:', items.filter((i) => i.selected));
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">장바구니</h1>
          <p className="text-sm text-neutral-500 mt-1">
            총 {items.length}개의 상품이 담겨있습니다
          </p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 좌측: 상품 목록 */}
          <div className="flex-1">
            <CartList
              items={items}
              onRemove={(productId) => {
                removeItem(productId);
                showToast('상품이 삭제되었습니다', 'success');
              }}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
              allSelected={allSelected}
            />

            {/* 선택 삭제 버튼 */}
            {items.length > 0 && (
              <div className="mt-4 flex justify-start">
                <button
                  type="button"
                  onClick={handleRemoveSelected}
                  disabled={!hasSelectedItems}
                  className="px-4 py-2 text-sm text-neutral-600 border border-neutral-300
                             rounded-lg hover:bg-neutral-100 disabled:opacity-50
                             disabled:cursor-not-allowed transition-colors"
                >
                  선택 삭제
                </button>
              </div>
            )}
          </div>

          {/* 우측: 주문 요약 (데스크톱) */}
          {items.length > 0 && (
            <div className="w-full lg:w-80 flex-shrink-0">
              <CartSummary summary={summary} onOrder={handleOrder} />
            </div>
          )}
        </div>
      </div>

      {/* 모바일 하단 고정 바 */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-neutral-600">
              선택 {summary.selectedCount}개
            </span>
            <span className="text-lg font-bold text-primary-600">
              {summary.grandTotal.toLocaleString('ko-KR')}원
            </span>
          </div>
          <button
            type="button"
            onClick={handleOrder}
            disabled={summary.selectedCount === 0}
            className="w-full py-4 bg-primary-500 text-white font-semibold rounded-xl
                       hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed
                       transition-colors active:scale-[0.98]"
          >
            주문하기
          </button>
        </div>
      )}

      {/* 모바일 하단 바 공간 확보 */}
      {items.length > 0 && <div className="lg:hidden h-32" />}
    </div>
  );
};

export default CartPage;
