import { useEffect, useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
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
    if (!isMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMobileSearch = () => {
    const query = prompt('검색어를 입력해 주세요');
    if (query?.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const mobileMenu = isMenuOpen ? (
    <div className="fixed inset-0 z-[1000] bg-black/70 md:hidden" onClick={() => setIsMenuOpen(false)}>
      <div
        className="absolute top-0 right-0 h-full w-[88%] max-w-[340px] bg-white shadow-2xl animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 p-4">
          <h2 className="text-lg font-bold">메뉴</h2>
          <button aria-label="메뉴 닫기" onClick={() => setIsMenuOpen(false)}>
            <X className="h-6 w-6 text-neutral-900" />
          </button>
        </div>

        <div className="h-[calc(100vh-60px)] space-y-6 overflow-y-auto p-4 pb-safe">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-neutral-500" />
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 min-[360px]:h-16 items-center justify-between gap-1.5 min-[360px]:gap-4 px-2.5 min-[360px]:px-4">
          <div className="flex items-center gap-1.5 min-[320px]:gap-3 md:gap-8">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src={logo}
                alt="세미콜론"
                className="h-8 min-[320px]:h-10 md:h-12 w-auto transition-transform hover:scale-105"
              />
            </Link>

            <div
              className="hidden md:block relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-primary-600">
                <Menu className="h-5 w-5" />
                카테고리
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품 또는 상점을 검색하세요"
                className="h-10 w-full px-4 pr-10 bg-neutral-100 border-none rounded-lg focus:bg-white focus:ring-1 focus:ring-primary-500 transition-all text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-neutral-400 hover:text-primary-500" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-0.5 min-[360px]:gap-2 md:gap-4">
            <button className="p-1.5 min-[320px]:p-2 md:hidden" aria-label="검색하기" onClick={handleMobileSearch}>
              <Search className="h-5 w-5 text-neutral-900" />
            </button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden text-neutral-900 min-[360px]:inline-flex"
                  aria-label="알림"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                </Button>
                <Link to="/cart" className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-neutral-900 min-[360px]:h-11 min-[360px]:w-11"
                    aria-label="장바구니"
                  >
                    <ShoppingBag className="h-5 w-5" />
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
                    <UserIcon className="h-4 w-4 text-white" />
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

            <button className="p-1.5 min-[320px]:p-2 md:hidden" aria-label="메뉴 열기" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-6 w-6 text-neutral-900" />
            </button>
          </div>
        </div>

        <div
          className={`absolute top-full left-0 w-full transition-all duration-300 ${isCategoryOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onMouseEnter={() => setIsCategoryOpen(true)}
          onMouseLeave={() => setIsCategoryOpen(false)}
        >
          <CategoryNav categories={categories} onClose={() => setIsCategoryOpen(false)} />
        </div>
      </header>

      {typeof document !== 'undefined' && mobileMenu ? createPortal(mobileMenu, document.body) : null}
    </>
  );
}
