import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-primary-700">Semicolon;</h3>
            <p className="text-sm text-neutral-600">
              취미를 사랑하는 사람들을 위한<br />
              프리미엄 중고거래 플랫폼
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">서비스</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link to="/search">상품 검색</Link></li>
              <li><Link to="/categories">카테고리</Link></li>
              <li><Link to="/seller">내 상점</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">고객지원</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link to="/notice">공지사항</Link></li>
              <li><Link to="/faq">자주 묻는 질문</Link></li>
              <li><Link to="/policy">이용약관</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <div className="text-sm text-neutral-600">
              <p>Email: help@semicolon.com</p>
              <p>Tel: 02-1234-5678</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500">
          © 2026 Semicolon Corp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
