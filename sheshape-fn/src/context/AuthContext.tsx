'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { User, UserProfile } from '@/types/user';
import { authService } from '@/services/authService';
import { profileService, ProfileSetupRequest, ProfileUpdateRequest, ProfileResponse } from '@/services/profileService';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  setupProfile: (profileData: ProfileSetupRequest) => Promise<void>;
  updateProfile: (profileData: ProfileUpdateRequest) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Set up axios interceptors for authentication
  useEffect(() => {
    // Add token to requests
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 unauthorized responses
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and user data on authentication errors
          localStorage.removeItem('token');
          setUser(null);
          
          // Only redirect if not already on an auth page
          const path = window.location.pathname;
          if (!path.includes('/login') && !path.includes('/register') && !path.includes('/forgot-password')) {
            toast.error('Your session has expired. Please log in again.');
            router.push('/login');
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      console.log(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert ProfileResponse to UserProfile
  const mapProfileResponseToUserProfile = (profileResponse: ProfileResponse): UserProfile => {
    return {
      id: profileResponse.id,
      firstName: profileResponse.firstName,
      lastName: profileResponse.lastName,
      dateOfBirth: profileResponse.dateOfBirth,
      gender: profileResponse.gender as UserProfile['gender'],
      phoneNumber: profileResponse.phoneNumber,
      profilePictureUrl: profileResponse.profilePictureUrl,
      heightCm: profileResponse.heightCm,
      currentWeightKg: profileResponse.currentWeightKg,
      targetWeightKg: profileResponse.targetWeightKg,
      fitnessLevel: profileResponse.fitnessLevel as UserProfile['fitnessLevel'],
      primaryGoal: profileResponse.primaryGoal as UserProfile['primaryGoal'],
      secondaryGoals: profileResponse.secondaryGoals,
      preferredActivityTypes: profileResponse.preferredActivityTypes as UserProfile['preferredActivityTypes'],
      workoutFrequency: profileResponse.workoutFrequency,
      workoutDuration: profileResponse.workoutDuration,
      preferredWorkoutDays: profileResponse.preferredWorkoutDays,
      preferredWorkoutTimes: profileResponse.preferredWorkoutTimes,
      dietaryRestrictions: profileResponse.dietaryRestrictions,
      healthConditions: profileResponse.healthConditions,
      medications: profileResponse.medications,
      emergencyContactName: profileResponse.emergencyContactName,
      emergencyContactPhone: profileResponse.emergencyContactPhone,
      timezone: profileResponse.timezone,
      language: profileResponse.language,
      emailNotifications: profileResponse.emailNotifications,
      pushNotifications: profileResponse.pushNotifications,
      privacyLevel: profileResponse.privacyLevel as UserProfile['privacyLevel'],
      createdAt: profileResponse.createdAt,
      updatedAt: profileResponse.updatedAt,
    };
  };

  // Helper function to determine redirect path based on user state
  const getRedirectPath = (userData: User) => {
    console.log(userData)
    // Admin users always go to admin dashboard
    if (userData.role === 'ADMIN') {
      return '/admin';
    }
    console.log("Inside redirect path");
    // Check if profile is complete using the profileCompleted flag from backend
    if (!userData.profileCompleted) {
      // First time user or incomplete profile -> profile setup
      console.log(userData)
      // alert(userData)
      return '/profile-setup';
    } else {
      // Returning user with complete profile -> dashboard
      return '/dashboard';
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      // Store the token
      localStorage.setItem('token', response.token);
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      // Fetch user data
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      toast.success('Successfully logged in');
      
      // Determine redirect path based on user role and profile status
      const redirectPath = getRedirectPath(userData);
      router.push(redirectPath);
      
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string, role = 'CLIENT') => {
    try {
      setIsLoading(true);
      await authService.register({ username, email, password, role });
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('You have been logged out');
    router.push('/');
  };

  // Update user data
  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No user is logged in');
      
      const response = await api.put(`/api/users/${user.id}`, userData);
      setUser(response.data);
      toast.success('User data updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Setup profile (first time)
  const setupProfile = async (profileData: ProfileSetupRequest) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No user is logged in');
      
      const profileResponse = await profileService.setupProfile(profileData);
      
      // Update user state with new profile data
      setUser(prevUser => {
        if (!prevUser) return null;
        
        return {
          ...prevUser,
          profileCompleted: true,
          profile: mapProfileResponseToUserProfile(profileResponse)
        };
      });
      
      toast.success('Profile setup completed successfully');
      
      // Redirect to dashboard after successful profile setup
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Failed to setup profile:', error);
      toast.error('Failed to setup profile. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData: ProfileUpdateRequest) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No user is logged in');
      
      const profileResponse = await profileService.updateProfile(profileData);
      
      // Update user state with new profile data
      setUser(prevUser => {
        if (!prevUser) return null;
        
        return {
          ...prevUser,
          profile: mapProfileResponseToUserProfile(profileResponse)
        };
      });
      
      toast.success('Profile updated successfully');
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload profile image
  const uploadProfileImage = async (file: File): Promise<string> => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No user is logged in');
      
      const response = await profileService.uploadProfilePicture(file);
      
      // Update user state with new profile image
      setUser(prevUser => {
        if (!prevUser) return null;
        
        return {
          ...prevUser,
          profile: {
            ...prevUser.profile,
            profilePictureUrl: response.profilePictureUrl
          }
        };
      });
      
      toast.success('Profile image updated');
      return response.profilePictureUrl;
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      toast.error('Failed to upload profile image');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      await authService.requestPasswordReset(email);
      toast.success('If an account exists with this email, you will receive password reset instructions shortly.');
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.success('If an account exists with this email, you will receive password reset instructions shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.resetPassword(token, password);
      toast.success('Password has been reset successfully');
      router.push('/login');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('Failed to reset password. The link may be expired or invalid.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No user is logged in');
      
      await authService.updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Password update failed:', error);
      toast.error('Failed to update password. Please check your current password.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        setupProfile,
        updateProfile,
        uploadProfileImage,
        requestPasswordReset,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}