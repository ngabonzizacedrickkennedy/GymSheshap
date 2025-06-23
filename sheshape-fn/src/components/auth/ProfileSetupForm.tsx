'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { ProfileSetupRequest } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Upload, User, Activity, Settings, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Validation schema for profile setup
const profileSetupSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must not exceed 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must not exceed 50 characters'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  phoneNumber: z.string().regex(/^[+]?[1-9]\d{1,14}$/, 'Please provide a valid phone number').optional(),

  // Physical Attributes
  heightCm: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must not exceed 250cm').optional(),
  currentWeightKg: z.number().min(30, 'Weight must be at least 30kg').max(300, 'Weight must not exceed 300kg').optional(),
  targetWeightKg: z.number().min(30, 'Target weight must be at least 30kg').max(300, 'Target weight must not exceed 300kg').optional(),

  // Fitness Profile
  fitnessLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  primaryGoal: z.enum(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'STRENGTH_BUILDING', 'ENDURANCE', 'FLEXIBILITY', 'GENERAL_FITNESS']).optional(),
  secondaryGoals: z.array(z.string()).optional(),
  preferredActivityTypes: z.array(z.enum(['CARDIO', 'STRENGTH_TRAINING', 'YOGA', 'PILATES', 'HIIT', 'DANCING', 'OUTDOOR'])).optional(),
  workoutFrequency: z.number().min(1, 'Minimum 1 workout per week').max(7, 'Maximum 7 workouts per week').optional(),
  workoutDuration: z.number().min(15, 'Minimum 15 minutes').max(180, 'Maximum 180 minutes').optional(),
  preferredWorkoutDays: z.array(z.string()).optional(),
  preferredWorkoutTimes: z.array(z.string()).optional(),

  // Health Information
  dietaryRestrictions: z.array(z.string()).optional(),
  healthConditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  emergencyContactName: z.string().max(100, 'Name must not exceed 100 characters').optional(),
  emergencyContactPhone: z.string().regex(/^[+]?[1-9]\d{1,14}$/, 'Please provide a valid emergency contact phone').optional(),

  // Preferences
  timezone: z.string().optional(),
  language: z.string().regex(/^[a-z]{2}$/, 'Language must be a valid 2-letter language code').optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  privacyLevel: z.enum(['PUBLIC', 'FRIENDS', 'PRIVATE']).optional(),
});

type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

type TabType = 'personal' | 'fitness' | 'health' | 'preferences';

const tabs: { id: TabType; label: string; icon: any }[] = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'fitness', label: 'Fitness Profile', icon: Activity },
  { id: 'health', label: 'Health Info', icon: AlertCircle },
  { id: 'preferences', label: 'Preferences', icon: Settings },
];

const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const workoutTimes = ['Early Morning (5-8 AM)', 'Morning (8-11 AM)', 'Afternoon (11 AM-2 PM)', 'Late Afternoon (2-5 PM)', 'Evening (5-8 PM)', 'Night (8-11 PM)'];
const commonDietaryRestrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Low-Fat', 'Halal', 'Kosher'];
const commonHealthConditions = ['Diabetes', 'High Blood Pressure', 'Heart Disease', 'Asthma', 'Arthritis', 'Back Problems', 'Knee Problems', 'None'];
const activityTypes = [
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'STRENGTH_TRAINING', label: 'Strength Training' },
  { value: 'YOGA', label: 'Yoga' },
  { value: 'PILATES', label: 'Pilates' },
  { value: 'HIIT', label: 'HIIT' },
  { value: 'DANCING', label: 'Dancing' },
  { value: 'OUTDOOR', label: 'Outdoor Activities' },
] as const;

export default function ProfileSetupForm() {
  const { setupProfile, uploadProfileImage } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(profileSetupSchema),
    mode: 'onChange',
  });

  // Calculate progress based on filled fields
  useEffect(() => {
    const values = getValues();
    const totalFields = Object.keys(profileSetupSchema.shape).length;
    const filledFields = Object.values(values).filter(value => 
      value !== undefined && value !== '' && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    
    setProgress((filledFields / totalFields) * 100);
  }, [watch(), getValues]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must not exceed 5MB');
        return;
      }

      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const nextTab = async () => {
    const isValid = await trigger();
    if (isValid) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      }
    }
  };

  const previousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const toggleArrayValue = (fieldName: keyof ProfileSetupFormValues, value: string) => {
    const currentValues = getValues(fieldName) as string[] || [];
    if (currentValues.includes(value)) {
      setValue(fieldName, currentValues.filter(v => v !== value) as any);
    } else {
      setValue(fieldName, [...currentValues, value] as any);
    }
  };

  const onSubmit = async (data: ProfileSetupFormValues) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
    try {
      // First, upload profile image if provided
      let profileImageUrl: string | undefined;
      if (profileImageFile) {
        profileImageUrl = await uploadProfileImage(profileImageFile);
      }

      // Convert form data to match backend DTO
      const profileData: ProfileSetupRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        heightCm: data.heightCm,
        currentWeightKg: data.currentWeightKg,
        targetWeightKg: data.targetWeightKg,
        fitnessLevel: data.fitnessLevel,
        primaryGoal: data.primaryGoal,
        secondaryGoals: data.secondaryGoals,
        preferredActivityTypes: data.preferredActivityTypes,
        workoutFrequency: data.workoutFrequency,
        workoutDuration: data.workoutDuration,
        preferredWorkoutDays: data.preferredWorkoutDays,
        preferredWorkoutTimes: data.preferredWorkoutTimes,
        dietaryRestrictions: data.dietaryRestrictions,
        healthConditions: data.healthConditions,
        medications: data.medications,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        timezone: data.timezone,
        language: data.language || 'en',
        emailNotifications: data.emailNotifications ?? true,
        pushNotifications: data.pushNotifications ?? true,
        privacyLevel: data.privacyLevel || 'FRIENDS',
      };
      
      // Setup the profile - this will trigger redirect in AuthContext
      await setupProfile(profileData);
      
      setSuccessMessage("Your profile has been successfully set up! Redirecting to your dashboard...");
      
    } catch (err: any) {
      console.error('Profile setup error:', err);
      setError(err.response?.data?.message || 'Profile setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Help us personalize your fitness journey
            </CardDescription>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-gray-500">{Math.round(progress)}% Complete</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center space-x-1 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab, index) => {
                const IconComponent = tab.icon;
                const isActive = tab.id === activeTab;
                const isCompleted = index < currentTabIndex;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-purple-600 shadow-sm'
                        : isCompleted
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error and Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                    
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center space-y-4 mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-500">Upload your profile picture (optional)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...register('dateOfBirth')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => setValue('gender', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        {...register('phoneNumber')}
                        placeholder="+1234567890"
                        className={errors.phoneNumber ? 'border-red-500' : ''}
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Fitness Profile Tab */}
              {activeTab === 'fitness' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">Fitness Profile</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="heightCm">Height (cm)</Label>
                      <Input
                        id="heightCm"
                        type="number"
                        {...register('heightCm', { valueAsNumber: true })}
                        placeholder="170"
                        className={errors.heightCm ? 'border-red-500' : ''}
                      />
                      {errors.heightCm && (
                        <p className="text-sm text-red-500">{errors.heightCm.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentWeightKg">Current Weight (kg)</Label>
                      <Input
                        id="currentWeightKg"
                        type="number"
                        {...register('currentWeightKg', { valueAsNumber: true })}
                        placeholder="70"
                        className={errors.currentWeightKg ? 'border-red-500' : ''}
                      />
                      {errors.currentWeightKg && (
                        <p className="text-sm text-red-500">{errors.currentWeightKg.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetWeightKg">Target Weight (kg)</Label>
                      <Input
                        id="targetWeightKg"
                        type="number"
                        {...register('targetWeightKg', { valueAsNumber: true })}
                        placeholder="65"
                        className={errors.targetWeightKg ? 'border-red-500' : ''}
                      />
                      {errors.targetWeightKg && (
                        <p className="text-sm text-red-500">{errors.targetWeightKg.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fitnessLevel">Fitness Level</Label>
                      <Select onValueChange={(value) => setValue('fitnessLevel', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fitness level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                          <SelectItem value="EXPERT">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryGoal">Primary Goal</Label>
                      <Select onValueChange={(value) => setValue('primaryGoal', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WEIGHT_LOSS">Weight Loss</SelectItem>
                          <SelectItem value="MUSCLE_GAIN">Muscle Gain</SelectItem>
                          <SelectItem value="STRENGTH_BUILDING">Strength Building</SelectItem>
                          <SelectItem value="ENDURANCE">Endurance</SelectItem>
                          <SelectItem value="FLEXIBILITY">Flexibility</SelectItem>
                          <SelectItem value="GENERAL_FITNESS">General Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Preferred Activity Types</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {activityTypes.map((activity) => (
                        <div key={activity.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={activity.value}
                            checked={(getValues('preferredActivityTypes') || []).includes(activity.value)}
                            onCheckedChange={() => toggleArrayValue('preferredActivityTypes', activity.value)}
                          />
                          <Label htmlFor={activity.value} className="text-sm">
                            {activity.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="workoutFrequency">Workouts per Week</Label>
                      <Input
                        id="workoutFrequency"
                        type="number"
                        min="1"
                        max="7"
                        {...register('workoutFrequency', { valueAsNumber: true })}
                        placeholder="3"
                        className={errors.workoutFrequency ? 'border-red-500' : ''}
                      />
                      {errors.workoutFrequency && (
                        <p className="text-sm text-red-500">{errors.workoutFrequency.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workoutDuration">Workout Duration (minutes)</Label>
                      <Input
                        id="workoutDuration"
                        type="number"
                        min="15"
                        max="180"
                        {...register('workoutDuration', { valueAsNumber: true })}
                        placeholder="60"
                        className={errors.workoutDuration ? 'border-red-500' : ''}
                      />
                      {errors.workoutDuration && (
                        <p className="text-sm text-red-500">{errors.workoutDuration.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Preferred Workout Days</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {workoutDays.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={(getValues('preferredWorkoutDays') || []).includes(day)}
                            onCheckedChange={() => toggleArrayValue('preferredWorkoutDays', day)}
                          />
                          <Label htmlFor={day} className="text-sm">
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Preferred Workout Times</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {workoutTimes.map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <Checkbox
                            id={time}
                            checked={(getValues('preferredWorkoutTimes') || []).includes(time)}
                            onCheckedChange={() => toggleArrayValue('preferredWorkoutTimes', time)}
                          />
                          <Label htmlFor={time} className="text-sm">
                            {time}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Health Information Tab */}
              {activeTab === 'health' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">Health Information</h3>
                  
                  <div className="space-y-4">
                    <Label>Dietary Restrictions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {commonDietaryRestrictions.map((restriction) => (
                        <div key={restriction} className="flex items-center space-x-2">
                          <Checkbox
                            id={restriction}
                            checked={(getValues('dietaryRestrictions') || []).includes(restriction)}
                            onCheckedChange={() => toggleArrayValue('dietaryRestrictions', restriction)}
                          />
                          <Label htmlFor={restriction} className="text-sm">
                            {restriction}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Health Conditions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {commonHealthConditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={(getValues('healthConditions') || []).includes(condition)}
                            onCheckedChange={() => toggleArrayValue('healthConditions', condition)}
                          />
                          <Label htmlFor={condition} className="text-sm">
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications (optional)</Label>
                    <Textarea
                      id="medications"
                      placeholder="List any medications you're currently taking..."
                      className="min-h-[100px]"
                      onChange={(e) => setValue('medications', e.target.value.split('\n').filter(med => med.trim()))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                      <Input
                        id="emergencyContactName"
                        {...register('emergencyContactName')}
                        placeholder="John Doe"
                        className={errors.emergencyContactName ? 'border-red-500' : ''}
                      />
                      {errors.emergencyContactName && (
                        <p className="text-sm text-red-500">{errors.emergencyContactName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyContactPhone"
                        {...register('emergencyContactPhone')}
                        placeholder="+1234567890"
                        className={errors.emergencyContactPhone ? 'border-red-500' : ''}
                      />
                      {errors.emergencyContactPhone && (
                        <p className="text-sm text-red-500">{errors.emergencyContactPhone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        {...register('timezone')}
                        placeholder="America/New_York"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select onValueChange={(value) => setValue('language', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacyLevel">Privacy Level</Label>
                    <Select onValueChange={(value) => setValue('privacyLevel', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select privacy level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="FRIENDS">Friends Only</SelectItem>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Notification Preferences</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="emailNotifications"
                          checked={getValues('emailNotifications') ?? true}
                          onCheckedChange={(checked) => setValue('emailNotifications', !!checked)}
                        />
                        <Label htmlFor="emailNotifications">
                          Email notifications for updates and reminders
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="pushNotifications"
                          checked={getValues('pushNotifications') ?? true}
                          onCheckedChange={(checked) => setValue('pushNotifications', !!checked)}
                        />
                        <Label htmlFor="pushNotifications">
                          Push notifications for workout reminders
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={previousTab}
                  disabled={isFirstTab}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                {isLastTab ? (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Setting up...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Complete Setup</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextTab}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}