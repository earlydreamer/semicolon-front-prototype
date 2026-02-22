import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Menu from 'lucide-react/dist/esm/icons/menu';
import Search from 'lucide-react/dist/esm/icons/search';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import X from 'lucide-react/dist/esm/icons/x';
import logo from '@/assets/logo.png';
import { CategoryNav } from '@/components/features/category/CategoryNav';
import { Button } from '@/components/common/Button';
import { productService } from '@/services/productService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import type { Category } from '@/types/category';
import { transformCategories } from '@/utils/category';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItemCount = useCartStore((state) => state.getTotalCount());
  const navigate = useNavigate();

  useEffect(() => {
    productService
      .getCategories()
      .then((data) => setCategories(transformCategories(data)))
      .catch((error) => console.error('카테고리를 불러오지 못했습니다.', error));
  }, []);

  useEffect(() => {
    if (!isMenuOpen && !isMobileSearchOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen, isMobileSearchOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      setIsMobileSearchOpen(false);
      setIsCategoryOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!isCategoryOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isCategoryOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsMobileSearchOpen(false);
  };

  const openMobileSearch = () => setIsMobileSearchOpen(true);
  const closeMobileSearch = () => setIsMobileSearchOpen(false);

  const handleCategoryBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsCategoryOpen(false);
    }
  };

  const mobileMenu = isMenuOpen ? (
    <div className="fixed inset-0 z-[1000] bg-black/70 md:hidden">
      <button
        type="button"
        className="absolute inset-0"
        onClick={() => setIsMenuOpen(false)}
        aria-label="모바일 메뉴 닫기"
        tabIndex={-1}
      />
      <div
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        className="absolute top-0 right-0 h-full w-[88%] max-w-[340px] bg-white shadow-2xl animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 p-4">
          <h2 id="mobile-menu-title" className="text-lg font-bold">메뉴</h2>
          <button type="button" aria-label="메뉴 닫기" onClick={() => setIsMenuOpen(false)}>
            <X className="h-6 w-6 text-neutral-900" aria-hidden="true" />
          </button>
        </div>

        <div className="h-[calc(100vh-60px)] space-y-6 overflow-y-auto p-4 pb-safe">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-neutral-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold">{user?.nickname}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/mypage" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    마이페이지
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                  로그아웃
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-center">로그인 / 회원가입</Button>
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100">
            <h3 className="mb-4 text-sm font-bold text-neutral-500">카테고리</h3>
            <CategoryNav variant="mobile" categories={categories} onClose={() => setIsMenuOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const mobileSearchPanel = isMobileSearchOpen ? (
    <div className="fixed inset-0 z-[1001] bg-black/60 md:hidden">
      <button
        type="button"
        className="absolute inset-0"
        onClick={closeMobileSearch}
        aria-label="모바일 검색 닫기"
        tabIndex={-1}
      />
      <div
        id="mobile-search-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-search-title"
        className="relative bg-white p-4 shadow-xl animate-in slide-in-from-top duration-200"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="mobile-search-title" className="text-sm font-semibold text-neutral-700">
            상품 검색
          </h2>
          <button
            type="button"
            onClick={closeMobileSearch}
            aria-label="검색 닫기"
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={handleSearch} className="space-y-3">
          <label htmlFor="mobile-search-input" className="sr-only">
            검색어 입력
          </label>
          <div className="relative">
            <input
              id="mobile-search-input"
              name="q"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품명, 브랜드, 상점명…"
              autoComplete="off"
              spellCheck={false}
              className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 pr-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          </div>
          <Button type="submit" className="w-full justify-center">
            검색하기
          </Button>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 min-[360px]:h-16 items-center justify-between gap-1.5 min-[360px]:gap-4 px-2.5 min-[360px]:px-4">
          <div className="flex items-center gap-1.5 min-[320px]:gap-3 md:gap-8">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src={logo}
                alt="세미콜론"
                width={144}
                height={48}
                className="h-8 min-[320px]:h-10 md:h-12 w-auto transition-transform hover:scale-105"
              />
            </Link>

            <div
              className="hidden md:flex items-center h-full relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
              onFocus={() => setIsCategoryOpen(true)}
              onBlur={handleCategoryBlur}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isCategoryOpen}
                aria-controls="desktop-category-nav"
                className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md px-2 py-1.5"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
                카테고리
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:block">
            <label htmlFor="header-search-input" className="sr-only">
              상품 또는 상점 검색
            </label>
            <div className="relative">
              <input
                id="header-search-input"
                name="q"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품 또는 상점을 검색하세요…"
                autoComplete="off"
                spellCheck={false}
                className="h-10 w-full px-4 pr-10 bg-neutral-100 border-none rounded-lg focus:bg-white focus:ring-1 focus:ring-primary-500 transition-[background-color,box-shadow] text-sm"
              />
              <button
                type="submit"
                aria-label="검색 실행"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4 text-neutral-400 hover:text-primary-500" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-0.5 min-[360px]:gap-2 md:gap-4">
            <button
              type="button"
              className="p-1.5 min-[320px]:p-2 md:hidden"
              aria-label="검색하기"
              aria-expanded={isMobileSearchOpen}
              aria-controls="mobile-search-panel"
              onClick={openMobileSearch}
            >
              <Search className="h-5 w-5 text-neutral-900" aria-hidden="true" />
            </button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden text-neutral-900 min-[360px]:inline-flex"
                  aria-label="알림"
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                </Button>
                <Link to="/cart" className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-neutral-900 min-[360px]:h-11 min-[360px]:w-11"
                    aria-label="장바구니"
                  >
                    <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  </Button>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-primary-500 rounded-full">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/mypage"
                  className="hidden md:flex items-center gap-2 bg-neutral-100 rounded-full pl-1 pr-3 py-1 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-300 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold">{user?.nickname}님</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex text-neutral-500 hover:text-red-600"
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">회원가입</Button>
                </Link>
              </div>
            )}

            <button
              type="button"
              className="p-1.5 min-[320px]:p-2 md:hidden"
              aria-label="메뉴 열기"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-panel"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6 text-neutral-900" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          id="desktop-category-nav"
          className={`absolute top-full left-0 w-full transition-opacity duration-300 motion-reduce:transition-none ${isCategoryOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onMouseEnter={() => setIsCategoryOpen(true)}
          onMouseLeave={() => setIsCategoryOpen(false)}
        >
          <CategoryNav categories={categories} onClose={() => setIsCategoryOpen(false)} />
        </div>
      </header>

      {typeof document !== 'undefined' && mobileMenu ? createPortal(mobileMenu, document.body) : null}
      {typeof document !== 'undefined' && mobileSearchPanel
        ? createPortal(mobileSearchPanel, document.body)
        : null}
    </>
  );
}
