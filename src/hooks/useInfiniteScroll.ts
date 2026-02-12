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
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loadTimerRef = useRef<number | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const displayItems = allItems.slice(0, page * pageSize);
  const hasMore = displayItems.length < allItems.length;

  // 초기화 및 아이템 추가 로드
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // 목업을 위한 지연 시간 (0.5초)
    loadTimerRef.current = window.setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoading(false);
      loadTimerRef.current = null;
    }, 500);
  }, [hasMore, isLoading]);

  useEffect(() => {
    return () => {
      if (loadTimerRef.current !== null) {
        window.clearTimeout(loadTimerRef.current);
      }
    };
  }, []);

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
