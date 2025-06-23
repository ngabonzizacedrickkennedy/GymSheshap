'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CartDrawer } from '@/components/shop/CartDrawer';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
        {/* <LoadingSpinner size='lg' /> */}
      </div>
      
      
      {/* Cart drawer for global access */}
      <CartDrawer />
    </div>
  );
}