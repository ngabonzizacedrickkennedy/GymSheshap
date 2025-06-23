'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import  ProfileSetupForm  from '@/components/auth/ProfileSetupForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CartDrawer } from '@/components/shop/CartDrawer';

export default function ProfileSetupPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // If user is not authenticated, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    
    // If user has already completed profile setup, redirect to dashboard
    if (!isLoading && isAuthenticated && user?.profile?.firstName) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Show loading state
  if (isLoading || (isAuthenticated && user?.profile?.firstName)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Only render setup form if authenticated and profile not set up
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <ProfileSetupForm />
      
      {/* Cart drawer for global access */}
      <CartDrawer />
    </div>
  );
}