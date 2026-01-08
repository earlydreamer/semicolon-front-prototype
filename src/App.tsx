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

import { ToastProvider } from '@/components/common/Toast';

// ...

function App() {
  return (
    <BrowserRouter>
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
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
