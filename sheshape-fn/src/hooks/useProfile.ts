// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileService, ProfileResponse, UserProfileSummary } from '@/services/profileService';
import { toast } from 'react-toastify';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [profileSummary, setProfileSummary] = useState<UserProfileSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load full profile
  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await profileService.getUserProfile();
      setProfile(profileData);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile summary
  const loadProfileSummary = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const summaryData = await profileService.getUserProfileSummary();
      setProfileSummary(summaryData);
    } catch (err: any) {
      console.error('Failed to load profile summary:', err);
      setError(err.response?.data?.message || 'Failed to load profile summary');
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile on mount or user change
  useEffect(() => {
    if (user && user.profileCompleted) {
      loadProfile();
    }
  }, [user]);

  return {
    profile,
    profileSummary,
    isLoading,
    error,
    loadProfile,
    loadProfileSummary,
    refetch: loadProfile,
  };
}

export default useProfile;