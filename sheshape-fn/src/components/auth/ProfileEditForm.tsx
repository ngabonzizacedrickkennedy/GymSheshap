'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { ProfileUpdateRequest } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Save, Upload, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Validation schema for profile updates (all fields optional)
const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must not exceed 50 characters').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must not exceed 50 characters').optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  phoneNumber: z.string().regex(/^[+]?[1-9]\d{1,14}$/, 'Please provide a valid phone number').optional().or(z.literal('')),
  heightCm: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must not exceed 250cm').optional(),
  currentWeightKg: z.number().min(30, 'Weight must be at least 30kg').max(300, 'Weight must not exceed 300kg').optional(),
  targetWeightKg: z.number().min(30, 'Target weight must be at least 30kg').max(300, 'Target weight must not exceed 300kg').optional(),
  fitnessLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  primaryGoal: z.enum(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'STRENGTH_BUILDING', 'ENDURANCE', 'FLEXIBILITY', 'GENERAL_FITNESS']).optional(),
  workoutFrequency: z.number().min(1, 'Minimum 1 workout per week').max(7, 'Maximum 7 workouts per week').optional(),
  workoutDuration: z.number().min(15, 'Minimum 15 minutes').max(180, 'Maximum 180 minutes').optional(),
  emergencyContactName: z.string().max(100, 'Name must not exceed 100 characters').optional().or(z.literal('')),
  emergencyContactPhone: z.string().regex(/^[+]?[1-9]\d{1,14}$/, 'Please provide a valid emergency contact phone').optional().or(z.literal('')),
  timezone: z.string().optional(),
  language: z.string().regex(/^[a-z]{2}$/, 'Language must be a valid 2-letter language code').optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  privacyLevel: z.enum(['PUBLIC', 'FRIENDS', 'PRIVATE']).optional(),
});

type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

interface ProfileEditFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProfileEditForm({ onSuccess, onCancel }: ProfileEditFormProps) {
  const { updateProfile, uploadProfileImage } = useAuth();
  const { profile, loadProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    getValues,
    reset,
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    mode: 'onChange',
  });

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender as any,
        phoneNumber: profile.phoneNumber || '',
        heightCm: profile.heightCm,
        currentWeightKg: profile.currentWeightKg,
        targetWeightKg: profile.targetWeightKg,
        fitnessLevel: profile.fitnessLevel as any,
        primaryGoal: profile.primaryGoal as any,
        workoutFrequency: profile.workoutFrequency,
        workoutDuration: profile.workoutDuration,
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactPhone: profile.emergencyContactPhone || '',
        timezone: profile.timezone || '',
        language: profile.language || 'en',
        emailNotifications: profile.emailNotifications ?? true,
        pushNotifications: profile.pushNotifications ?? true,
        privacyLevel: profile.privacyLevel as any || 'FRIENDS',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileUpdateFormValues) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
    try {
      // Filter out empty strings and convert to undefined
      const cleanedData: ProfileUpdateRequest = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      ) as ProfileUpdateRequest;

      await updateProfile(cleanedData);
      await loadProfile(); // Refresh profile data
      
      setSuccessMessage('Profile updated successfully!');
      if (onSuccess) {
        setTimeout(onSuccess, 1500); // Give time to show success message
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    try {
      setIsLoading(true);
      await uploadProfileImage(file);
      await loadProfile(); // Refresh to get new image URL
      setSuccessMessage('Profile image updated successfully!');
    } catch (err: any) {
      setError('Failed to upload profile image');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
        <CardDescription className="text-center">
          Update your personal information and preferences
        </CardDescription>
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
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="fitness">Fitness</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                    {profile.profilePictureUrl ? (
                      <img 
                        src={profile.profilePictureUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-colors cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">Click to update profile picture</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
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
                  <Label htmlFor="lastName">Last Name</Label>
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
                  <Select 
                    value={getValues('gender')} 
                    onValueChange={(value) => setValue('gender', value as any)}
                  >
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
            </TabsContent>

            {/* Fitness Tab */}
            <TabsContent value="fitness" className="space-y-6">
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
                  <Select 
                    value={getValues('fitnessLevel')} 
                    onValueChange={(value) => setValue('fitnessLevel', value as any)}
                  >
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
                  <Select 
                    value={getValues('primaryGoal')} 
                    onValueChange={(value) => setValue('primaryGoal', value as any)}
                  >
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
            </TabsContent>

            {/* Health Tab */}
            <TabsContent value="health" className="space-y-6">
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

              <div className="space-y-2">
                <Label>Health Information</Label>
                <p className="text-sm text-gray-600">
                  For detailed health information updates, please contact your healthcare provider.
                  This section shows read-only information from your initial setup.
                </p>
                {profile.healthConditions && profile.healthConditions.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-sm">Health Conditions:</p>
                    <p className="text-sm text-gray-600">{profile.healthConditions.join(', ')}</p>
                  </div>
                )}
                {profile.dietaryRestrictions && profile.dietaryRestrictions.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-sm">Dietary Restrictions:</p>
                    <p className="text-sm text-gray-600">{profile.dietaryRestrictions.join(', ')}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
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
                  <Select 
                    value={getValues('language')} 
                    onValueChange={(value) => setValue('language', value)}
                  >
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
                <Select 
                  value={getValues('privacyLevel')} 
                  onValueChange={(value) => setValue('privacyLevel', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select privacy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public - Anyone can see your profile</SelectItem>
                    <SelectItem value="FRIENDS">Friends Only - Only friends can see your profile</SelectItem>
                    <SelectItem value="PRIVATE">Private - Only you can see your profile</SelectItem>
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
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}