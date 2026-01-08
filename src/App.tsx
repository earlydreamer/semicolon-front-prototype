import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from '@/components/layout/DefaultLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Search } from 'lucide-react';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { HomePage } from '@/pages/HomePage';

function DesignSystemPage() {
  // ... (DesignSystemPage Content remains same)
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Inputs</h2>
        <div className="grid max-w-md gap-4">
          <Input label="Email" placeholder="example@email.com" />
          <Input label="With Icon" leftIcon={<Search className="h-4 w-4" />} />
          <Input label="Error State" error="Invalid email address" />
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Cards</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-bold">Elevated Card</h3>
            <p className="text-neutral-600">Default card style</p>
          </Card>
import { lazy, Suspense } from 'react';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

// The original DesignSystemPage function definition is removed as it's now lazy loaded.
// The content of DesignSystemPage is assumed to be in './pages/DesignSystemPage'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<HomePage />} />
            <Route path="categories/:categoryId" element={<CategoryPage />} />
            <Route path="design" element={<DesignSystemPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
