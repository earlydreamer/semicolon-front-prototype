import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
const SettlementAccountPage = lazy(() => import('./pages/SettlementAccountPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NoticePage = lazy(() => import('./pages/NoticePage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Admin pages
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminAuthGuard = lazy(() => import('./components/layout/AdminAuthGuard'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ProductManagePage = lazy(() => import('./pages/admin/ProductManagePage'));
const UserManagePage = lazy(() => import('./pages/admin/UserManagePage'));
const CategoryManagePage = lazy(() => import('./pages/admin/CategoryManagePage'));
const ReportManagePage = lazy(() => import('./pages/admin/ReportManagePage'));
const CouponManagePage = lazy(() => import('./pages/admin/CouponManagePage'));
const BannerManagePage = lazy(() => import('./pages/admin/BannerManagePage'));

import { ToastProvider } from '@/components/common/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// GitHub Pages base URL
const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <ToastProvider>
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes>
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
                <Route path="mypage/profile" element={<ProfilePage />} />
                <Route path="shop/:shopId" element={<ShopPage />} />
                <Route path="order" element={<OrderPage />} />
                <Route path="order/complete" element={<OrderCompletePage />} />
                <Route path="seller" element={<SellerPage />} />
                <Route path="seller/products/new" element={<ProductRegisterPage />} />
                <Route path="seller/products/:productId/edit" element={<ProductEditPage />} />
                <Route path="seller/shop" element={<MyShopSettingsPage />} />
                <Route path="mypage/settlement" element={<SettlementAccountPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="notice" element={<NoticePage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="policy" element={<PolicyPage />} />
                <Route path="categories" element={<Navigate to="/" replace />} />
              </Route>

              <Route path="admin/login" element={<AdminLoginPage />} />
              <Route path="admin" element={<AdminAuthGuard />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="banners" element={<BannerManagePage />} />
                  <Route path="products" element={<ProductManagePage />} />
                  <Route path="users" element={<UserManagePage />} />
                  <Route path="reports" element={<ReportManagePage />} />
                  <Route path="coupons" element={<CouponManagePage />} />
                  <Route path="categories" element={<CategoryManagePage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
