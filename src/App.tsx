import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DefaultLayout } from '@/components/layout/DefaultLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';

// 페이지 컴포넌트를 지연 로딩합니다.
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const EmailVerificationPage = lazy(() => import('./pages/EmailVerificationPage'));
const EmailVerificationPendingPage = lazy(() => import('./pages/EmailVerificationPendingPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const MyPage = lazy(() => import('./pages/MyPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const LikedProductsPage = lazy(() => import('./pages/LikedProductsPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const OrderCompletePage = lazy(() => import('./pages/OrderCompletePage'));

// 토스 결제 페이지입니다.
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('./pages/SuccessPage'));
const PaymentFailPage = lazy(() => import('./pages/FailPage'));

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

// 관리자 페이지입니다.
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminAuthGuard = lazy(() => import('./components/layout/AdminAuthGuard'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ProductManagePage = lazy(() => import('./pages/admin/ProductManagePage'));
const UserManagePage = lazy(() => import('./pages/admin/UserManagePage'));
const CategoryManagePage = lazy(() => import('./pages/admin/CategoryManagePage'));
const ReportManagePage = lazy(() => import('./pages/admin/ReportManagePage'));
const CouponManagePage = lazy(() => import('./pages/admin/CouponManagePage'));
const SettlementManagePage = lazy(() => import('./pages/admin/SettlementManagePage'));
const BannerManagePage = lazy(() => import('./pages/admin/BannerManagePage'));

import { ToastProvider } from '@/components/common/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// GitHub Pages 배포를 위한 base URL입니다.
const basename = import.meta.env.BASE_URL;

function App() {
  const { initialize, isInitialized, isAuthenticated } = useAuthStore();
  const { fetchItems } = useCartStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    } else {
      // 로그아웃 시 장바구니 상태를 초기화합니다.
      useCartStore.setState({ items: [] });
    }
  }, [isAuthenticated, fetchItems]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <ToastProvider>
          <Suspense fallback={<div className="flex h-screen items-center justify-center">로딩 중...</div>}>
            <Routes>
              {/* 일반 사용자 페이지 */}
              <Route element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path="categories/:categoryId" element={<CategoryPage />} />
                <Route path="products/:productId" element={<ProductDetailPage />} />
                <Route path="design" element={<DesignSystemPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="email/verify" element={<EmailVerificationPage />} />
                <Route path="email/pending" element={<EmailVerificationPendingPage />} />
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

                {/* 토스 결제 페이지 */}
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="payment/success" element={<PaymentSuccessPage />} />
                <Route path="payment/fail" element={<PaymentFailPage />} />

                {/* 백엔드 리다이렉트 경로 호환용 별칭 */}
                <Route path="payments/success" element={<PaymentSuccessPage />} />
                <Route path="payments/fail" element={<PaymentFailPage />} />
                <Route path="payments/toss/success" element={<PaymentSuccessPage />} />
                <Route path="payments/toss/fail" element={<PaymentFailPage />} />
              </Route>

              {/*
                관리자 페이지입니다.

                [중요] 보안 관련 주의사항
                - 현재: 프론트엔드 Mock 인증만 적용되어 있습니다.
                - 추후 필수 작업:
                  1. 관리자 도메인 분리
                  2. 백엔드 권한 검증 연동
                  3. 프론트 단독 제어에 의존하지 않도록 보강
              */}
              <Route path="admin/login" element={<AdminLoginPage />} />
              <Route path="admin" element={<AdminAuthGuard />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="banners" element={<BannerManagePage />} />
                  <Route path="products" element={<ProductManagePage />} />
                  <Route path="users" element={<UserManagePage />} />
                  <Route path="reports" element={<ReportManagePage />} />
                  <Route path="coupons" element={<CouponManagePage />} />
                  <Route path="settlements" element={<SettlementManagePage />} />
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
