'use client';

import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { CartDrawer } from '@/components/shop/CartDrawer';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <PasswordResetForm />
      </div>
      
      {/* Cart drawer for global access */}
      <CartDrawer />
    </div>
  );
}