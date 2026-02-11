import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu';
import Search from 'lucide-react/dist/esm/icons/search';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Bell from 'lucide-react/dist/esm/icons/bell';
import X from 'lucide-react/dist/esm/icons/x';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { CategoryNav } from '@/components/features/category/CategoryNav';
import { productService } from '@/services/productService';
import { transformCategories } from '@/utils/category';
import type { Category } from '@/types/category';
import logo from '@/assets/logo.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItemCount = useCartStore((state) => state.getTotalCount());
  const navigate = useNavigate();

  useEffect(() => {
    productService.getCategories()
      .then(data => setCategories(transformCategories(data)))
      .catch((error) => console.error('Failed to load categories', error));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMobileSearch = () => {
    const query = prompt('검색어를 입력하세요');
    if (query?.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 min-[360px]:h-16 items-center justify-between px-3 min-[360px]:px-4 gap-2 min-[360px]:gap-4">
        {/* Left Section: Logo & Category */}
        <div className="flex items-center gap-2 min-[320px]:gap-3 md:gap-8">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src={logo} 
              alt="?뺤퓼" 
              className="h-8 min-[320px]:h-10 md:h-12 w-auto transition-transform hover:scale-105" 
            />
          </Link>

          {/* Desktop Category Trigger */}
          <div 
            className="hidden md:block relative"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button 
              className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-primary-600"
            >
              <Menu className="h-5 w-5" />
              移댄뀒怨좊━
            </button>
            
            {/* Category Dropdown Overlay */}
            {isCategoryOpen && (
              <div className="absolute top-full left-[-20px] pt-4 w-screen max-w-screen-xl">
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:block">
          <div className="relative">
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="?곹뭹紐? @?곸젏紐??낅젰" 
               className="h-10 w-full px-4 pr-10 bg-neutral-100 border-none rounded-lg focus:bg-white focus:ring-1 focus:ring-primary-500 transition-all text-sm"
             />
             <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
               <Search className="h-4 w-4 text-neutral-400 hover:text-primary-500" />
             </button>
          </div>
        </form>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1 min-[320px]:gap-2 md:gap-4">
          <button className="md:hidden p-1.5 min-[320px]:p-2" onClick={handleMobileSearch}>
            <Search className="h-5 w-5 text-neutral-900" />
          </button>

          {isAuthenticated ? (
             <>
               <Button variant="ghost" size="icon" className="text-neutral-900 relative">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
               </Button>
               <Link to="/cart" className="relative">
                 <Button variant="ghost" size="icon" className="text-neutral-900">
                   <ShoppingBag className="h-5 w-5" />
                 </Button>
                 {cartItemCount > 0 && (
                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center
                                    text-[10px] font-bold text-white bg-primary-500 rounded-full">
                     {cartItemCount > 99 ? '99+' : cartItemCount}
                   </span>
                 )}
               </Link>
               <Link to="/mypage" className="hidden md:flex items-center gap-2 bg-neutral-100 rounded-full pl-1 pr-3 py-1 hover:bg-neutral-200 transition-colors cursor-pointer">
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
                 濡쒓렇?꾩썐
               </Button>
             </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login">
                <Button variant="ghost" size="sm">로그인</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6 text-neutral-900" />
          </button>
        </div>
      </div>

      {/* Desktop Category Nav Overlay - Positioned outside the flex container to be full width relative to header if needed */}
      <div 
        className={`absolute top-full left-0 w-full transition-all duration-300 ${isCategoryOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onMouseEnter={() => setIsCategoryOpen(true)}
        onMouseLeave={() => setIsCategoryOpen(false)}
      >
        <CategoryNav 
          categories={categories} 
          onClose={() => setIsCategoryOpen(false)}
        />
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <h2 className="text-lg font-bold">硫붾돱</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6 text-neutral-900" />
              </button>
            </div>
            
            <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-60px)]">
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
                      <Button variant="outline" className="w-full justify-center">留덉씠?섏씠吏</Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>濡쒓렇?꾩썐</Button>
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
                <h3 className="mb-4 text-sm font-bold text-neutral-500">移댄뀒怨좊━</h3>
                <CategoryNav 
                  variant="mobile" 
                  categories={categories} 
                  onClose={() => setIsMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

