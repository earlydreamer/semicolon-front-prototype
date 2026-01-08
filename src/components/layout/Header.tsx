import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="primary" size="sm">
            판매하기
          </Button>
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
              <Link to="/mypage" className="py-2 text-neutral-700 hover:text-primary-600">
                마이페이지
              </Link>
              <Link to="/cart" className="py-2 text-neutral-700 hover:text-primary-600">
                장바구니
              </Link>
            </nav>
            <Button className="w-full" variant="primary">
              판매하기
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
