'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
  requireCompleteProfile?: boolean;
  redirectTo?: string;
}

export function RouteGuard({
  children,
  requireAuth = true,
  requireRole,
  requireCompleteProfile = false,
  redirectTo = '/login'
}: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role requirement
    if (requireRole && user?.role !== requireRole) {
      // Redirect based on user's actual role
      if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
      return;
    }

    // Check complete profile requirement
    if (requireCompleteProfile && user && (!user.profile?.firstName || !user.profile?.lastName)) {
      router.push('/profile-setup');
      return;
    }

    // If user has complete profile but is on profile setup page, redirect to dashboard
    if (user && user.profile?.firstName && user.profile?.lastName && window.location.pathname === '/profile-setup') {
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return;
    }

  }, [user, isAuthenticated, isLoading, requireAuth, requireRole, requireCompleteProfile, redirectTo, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not authenticated and auth is required, don't render anything (redirect is happening)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If role is required and user doesn't have it, don't render anything (redirect is happening)
  if (requireRole && user?.role !== requireRole) {
    return null;
  }

  // If complete profile is required and user doesn't have it, don't render anything (redirect is happening)
  if (requireCompleteProfile && user && (!user.profile?.firstName || !user.profile?.lastName)) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
}