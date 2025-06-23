// services/profileService.ts
import { api } from '@/lib/api';

// Profile-related types based on your backend DTOs
export interface ProfileSetupRequest {
  // Basic Profile Information
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phoneNumber?: string;

  // Physical Attributes
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;

  // Fitness Profile
  fitnessLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  primaryGoal?: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH_BUILDING' | 'ENDURANCE' | 'FLEXIBILITY' | 'GENERAL_FITNESS';
  secondaryGoals?: string[];
  preferredActivityTypes?: ('CARDIO' | 'STRENGTH_TRAINING' | 'YOGA' | 'PILATES' | 'HIIT' | 'DANCING' | 'OUTDOOR')[];
  workoutFrequency?: number;
  workoutDuration?: number;
  preferredWorkoutDays?: string[];
  preferredWorkoutTimes?: string[];

  // Health Information
  dietaryRestrictions?: string[];
  healthConditions?: string[];
  medications?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Preferences
  timezone?: string;
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  privacyLevel?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phoneNumber?: string;
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  fitnessLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  primaryGoal?: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH_BUILDING' | 'ENDURANCE' | 'FLEXIBILITY' | 'GENERAL_FITNESS';
  secondaryGoals?: string[];
  preferredActivityTypes?: ('CARDIO' | 'STRENGTH_TRAINING' | 'YOGA' | 'PILATES' | 'HIIT' | 'DANCING' | 'OUTDOOR')[];
  workoutFrequency?: number;
  workoutDuration?: number;
  preferredWorkoutDays?: string[];
  preferredWorkoutTimes?: string[];
  dietaryRestrictions?: string[];
  healthConditions?: string[];
  medications?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  timezone?: string;
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  privacyLevel?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
}

export interface ProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  
  // Physical attributes
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  
  // Fitness profile
  fitnessLevel?: string;
  primaryGoal?: string;
  secondaryGoals?: string[];
  preferredActivityTypes?: string[];
  workoutFrequency?: number;
  workoutDuration?: number;
  preferredWorkoutDays?: string[];
  preferredWorkoutTimes?: string[];
  
  // Health information
  dietaryRestrictions?: string[];
  healthConditions?: string[];
  medications?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // Preferences
  timezone?: string;
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  privacyLevel?: string;
  
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileSummary {
  id: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePictureUrl?: string;
  fitnessLevel?: string;
  primaryGoal?: string;
  profileCompleted: boolean;
}

export interface ProfilePictureResponse {
  profilePictureUrl: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Profile service with API calls
export const profileService = {
  // Setup user profile (first time)
  async setupProfile(request: ProfileSetupRequest): Promise<ProfileResponse> {
    const response = await api.post<ApiResponse<ProfileResponse>>('/api/profile/setup', request);
    return response.data.data;
  },

  // Update existing profile
  async updateProfile(request: ProfileUpdateRequest): Promise<ProfileResponse> {
    const response = await api.put<ApiResponse<ProfileResponse>>('/api/profile/update', request);
    return response.data.data;
  },

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<ProfilePictureResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<ProfilePictureResponse>>(
      '/api/profile/picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.data;
  },

  // Get user profile
  async getUserProfile(): Promise<ProfileResponse> {
    const response = await api.get<ApiResponse<ProfileResponse>>('/api/profile');
    return response.data.data;
  },

  // Get profile summary
  async getUserProfileSummary(): Promise<UserProfileSummary> {
    const response = await api.get<ApiResponse<UserProfileSummary>>('/api/profile/summary');
    return response.data.data;
  },
};