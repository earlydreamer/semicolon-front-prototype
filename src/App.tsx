import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from '@/components/layout/DefaultLayout';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const MyPage = lazy(() => import('./pages/MyPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const LikedProductsPage = lazy(() => import('./pages/LikedProductsPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const OrderCompletePage = lazy(() => import('./pages/OrderCompletePage'));
const SellerPage = lazy(() => import('./pages/SellerPage'));
const ProductRegisterPage = lazy(() => import('./pages/ProductRegisterPage'));
const ProductEditPage = lazy(() => import('./pages/ProductEditPage'));
const MyShopSettingsPage = lazy(() => import('./pages/MyShopSettingsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

// Admin pages
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ProductManagePage = lazy(() => import('./pages/admin/ProductManagePage'));
const UserManagePage = lazy(() => import('./pages/admin/UserManagePage'));
const CategoryManagePage = lazy(() => import('./pages/admin/CategoryManagePage'));
const ReportManagePage = lazy(() => import('./pages/admin/ReportManagePage'));
const CouponManagePage = lazy(() => import('./pages/admin/CouponManagePage'));
const SettlementManagePage = lazy(() => import('./pages/admin/SettlementManagePage'));

import { ToastProvider } from '@/components/common/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// GitHub Pages 배포 시 base URL 설정
const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <ToastProvider>
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes>
              {/* 일반 사용자 페이지 */}
              <Route element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path="categories/:categoryId" element={<CategoryPage />} />
                <Route path="products/:productId" element={<ProductDetailPage />} />
                <Route path="design" element={<DesignSystemPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="mypage" element={<MyPage />} />
                <Route path="mypage/orders" element={<OrderHistoryPage />} />
                <Route path="mypage/likes" element={<LikedProductsPage />} />
                <Route path="shop/:shopId" element={<ShopPage />} />
                <Route path="order" element={<OrderPage />} />
                <Route path="order/complete" element={<OrderCompletePage />} />
                <Route path="seller" element={<SellerPage />} />
                <Route path="seller/products/new" element={<ProductRegisterPage />} />
                <Route path="seller/products/:productId/edit" element={<ProductEditPage />} />
                <Route path="seller/shop" element={<MyShopSettingsPage />} />
                <Route path="search" element={<SearchPage />} />
              </Route>

              {/* 관리자 페이지 */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<ProductManagePage />} />
                <Route path="users" element={<UserManagePage />} />
                <Route path="reports" element={<ReportManagePage />} />
                <Route path="coupons" element={<CouponManagePage />} />
                <Route path="settlements" element={<SettlementManagePage />} />
                <Route path="categories" element={<CategoryManagePage />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

