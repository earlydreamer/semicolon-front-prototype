import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/stores/useAuthStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-neutral-0/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">Semicolon;</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <div className="w-full max-w-md">
            <Input 
              placeholder="어떤 취미를 찾으시나요?" 
              rightIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center space-x-2 md:flex">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/mypage">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="ml-2">
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">로그인</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link to="/signup">회원가입</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-neutral-800" />
          ) : (
            <Menu className="h-6 w-6 text-neutral-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-neutral-200 bg-neutral-0 px-4 py-4 md:hidden">
          <div className="space-y-4">
            <Input 
              placeholder="검색어를 입력하세요" 
            />
            <nav className="flex flex-col space-y-2">
              <Link to="/categories" className="py-2 text-neutral-700 hover:text-primary-600">
                카테고리
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/mypage" className="py-2 text-neutral-700 hover:text-primary-600">
                    마이페이지
                  </Link>
                  <Link to="/cart" className="py-2 text-neutral-700 hover:text-primary-600">
                    장바구니
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="py-2 text-left text-neutral-700 hover:text-error-600"
                  >
                    로그아웃
                  </button>
                </>
              )}
            </nav>
            {!isAuthenticated && (
              <div className="flex gap-2">
                 <Button className="flex-1" variant="ghost" asChild>
                  <Link to="/login">로그인</Link>
                </Button>
                <Button className="flex-1" variant="primary" asChild>
                  <Link to="/signup">회원가입</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
