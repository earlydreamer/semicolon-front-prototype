import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  pageSize: number;
  rootMargin?: string;
}

/**
 * 무한 스크롤 로직을 담당하는 커스텀 훅
 * @param allItems 전체 아이템 리스트 (목업 단계이므로 클라이언트 사이드 페이징 수행)
 * @param options pageSize 및 IntersectionObserver 옵션
 */
export function useInfiniteScroll<T>(
  allItems: T[],
  { pageSize, rootMargin = '200px' }: UseInfiniteScrollOptions
) {
  const [displayItems, setDisplayItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 초기화 및 아이템 추가 로드
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // 목업을 위한 지연 시간 (0.5초)
    setTimeout(() => {
      const currentCount = displayItems.length;
      const nextItems = allItems.slice(0, currentCount + pageSize);
      
      setDisplayItems(nextItems);
      setHasMore(nextItems.length < allItems.length);
      setIsLoading(false);
    }, 500);
  }, [allItems, displayItems.length, hasMore, isLoading, pageSize]);

  // 전체 아이템이나 필터가 변경될 때 초기화 (참조가 바뀌어도 내용(ID)이 같으면 무시하도록 개선 가능)
  useEffect(() => {
    const initialItems = allItems.slice(0, pageSize);
    setDisplayItems((prev) => {
      // 이미 내용이 같다면 업데이트하지 않음 (무한 루프 방지 장치)
      const getId = (item: any) => item.productUuid || item.id;
      if (prev.length === initialItems.length && 
          prev.every((item, idx) => getId(item) === getId(initialItems[idx]))) {
        return prev;
      }
      return initialItems;
    });
    setHasMore(initialItems.length < allItems.length);
    setIsLoading(false);
  }, [allItems, pageSize]);

  // Intersection Observer 설정
  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore, rootMargin]);

  return {
    displayItems,
    isLoading,
    hasMore,
    observerTarget,
  };
}
