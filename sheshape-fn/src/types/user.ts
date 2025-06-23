// types/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'CLIENT' | 'TRAINER' | 'NUTRITIONIST' | 'ADMIN';
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id?: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phoneNumber?: string;
  profilePictureUrl?: string;
  bio?: string;
  
  // Physical attributes
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  
  // Fitness profile
  fitnessLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  primaryGoal?: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH_BUILDING' | 'ENDURANCE' | 'FLEXIBILITY' | 'GENERAL_FITNESS';
  secondaryGoals?: string[];
  preferredActivityTypes?: ('CARDIO' | 'STRENGTH_TRAINING' | 'YOGA' | 'PILATES' | 'HIIT' | 'DANCING' | 'OUTDOOR')[];
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
  privacyLevel?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  
  createdAt?: string;
  updatedAt?: string;
}

// Legacy Profile interface for backward compatibility
export interface Profile extends UserProfile {}

// Simplified profile update interface for basic operations
export interface BasicProfileUpdate {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
}

// Legacy interface for compatibility with existing code
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
}

// Authentication response types
export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  role: string;
  authorities: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

// Complete profile data structure based on backend
export interface CompleteProfile {
  // Basic profile
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
  fitnessLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  primaryGoal?: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH_BUILDING' | 'ENDURANCE' | 'FLEXIBILITY' | 'GENERAL_FITNESS';
  secondaryGoals?: string[];
  preferredActivityTypes?: ('CARDIO' | 'STRENGTH_TRAINING' | 'YOGA' | 'PILATES' | 'HIIT' | 'DANCING' | 'OUTDOOR')[];
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
  privacyLevel?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  
  // Metadata
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}