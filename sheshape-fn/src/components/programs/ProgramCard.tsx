'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Phone, 
  Upload, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Weight, 
  Ruler, 
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Progress } from '@/components/ui/progress';

// Form schema using zod
const profileSetupSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500, { message: 'Bio cannot exceed 500 characters' }).optional(),
  
  // Fitness Information
  age: z.string().optional().transform(val => val === '' ? undefined : Number(val)),
  height: z.string().optional().transform(val => val === '' ? undefined : Number(val)),
  weight: z.string().optional().transform(val => val === '' ? undefined : Number(val)),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
  fitnessGoal: z.enum(['weight_loss', 'muscle_gain', 'maintenance', 'overall_health', 'flexibility']).optional(),
  location: z.string().optional(),
  
  // Preferences
  preferredWorkoutDays: z.array(z.string()).optional(),
  workoutDuration: z.string().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

export function ProfileSetupForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [setupProgress, setSetupProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
    control,
  } = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      phoneNumber: user?.profile?.phoneNumber || '',
      bio: user?.profile?.bio || '',
      activityLevel: 'moderate',
      fitnessGoal: 'overall_health',
      preferredWorkoutDays: [],
      workoutDuration: '30-45',
      dietaryRestrictions: [],
      fitnessLevel: 'beginner',
    },
    mode: 'onChange',
  });

  // Update progress bar based on form completion
  const updateProgress = () => {
    const values = getValues();
    let completedFields = 0;
    let totalFields = 0;
    
    // Count filled personal fields
    ['firstName', 'lastName', 'phoneNumber', 'bio', 'location'].forEach(field => {
      totalFields++;
      if (values[field as keyof ProfileSetupFormValues]) completedFields++;
    });
    
    // Count filled fitness fields
    ['age', 'height', 'weight', 'activityLevel', 'fitnessGoal'].forEach(field => {
      totalFields++;
      if (values[field as keyof ProfileSetupFormValues]) completedFields++;
    });
    
    // Count filled preferences fields
    ['workoutDuration', 'fitnessLevel'].forEach(field => {
      totalFields++;
      if (values[field as keyof ProfileSetupFormValues]) completedFields++;
    });
    
    // Count array fields
    if (values.preferredWorkoutDays && values.preferredWorkoutDays.length > 0) {
      completedFields++;
    }
    totalFields++;
    
    if (values.dietaryRestrictions && values.dietaryRestrictions.length > 0) {
      completedFields++;
    }
    totalFields++;
    
    // Add profile image to counts
    totalFields++;
    if (profileImage) completedFields++;
    
    const progress = Math.round((completedFields / totalFields) * 100);
    setSetupProgress(progress);
  };

  // Track changes for progress updates
  const watchedValues = watch();
  
  // Update progress when form values change
  useEffect(() => {
    updateProgress();
  }, [watchedValues]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          updateProgress();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const nextTab = () => {
    if (activeTab === 'personal') setActiveTab('fitness');
    else if (activeTab === 'fitness') setActiveTab('preferences');
  };

  const previousTab = () => {
    if (activeTab === 'preferences') setActiveTab('fitness');
    else if (activeTab === 'fitness') setActiveTab('personal');
  };

  const toggleWorkoutDay = (day: string) => {
    const currentDays = getValues('preferredWorkoutDays') || [];
    if (currentDays.includes(day)) {
      setValue('preferredWorkoutDays', currentDays.filter(d => d !== day));
    } else {
      setValue('preferredWorkoutDays', [...currentDays, day]);
    }
    updateProgress();
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const currentRestrictions = getValues('dietaryRestrictions') || [];
    if (currentRestrictions.includes(restriction)) {
      setValue('dietaryRestrictions', currentRestrictions.filter(r => r !== restriction));
    } else {
      setValue('dietaryRestrictions', [...currentRestrictions, restriction]);
    }
    updateProgress();
  };

  const onSubmit = async (data: ProfileSetupFormValues) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
    try {
      // Format the data for the API
      const formattedData = {
        ...data,
        profileImage: profileImage || undefined,
      };
      
      // In a real app, this would make an API call to update the profile
      // and upload the profile image if changed
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSuccessMessage("Your profile has been successfully set up! You'll be redirected to your dashboard in a moment.");
      
      // Redirect to dashboard after successful setup
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: any) {
      console.error('Profile setup error:', err);
      setError(err.response?.data?.message || 'Profile setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Watch form inputs to enable/disable the "Next" button
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const isPersonalInfoComplete = firstName && lastName;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Let's personalize your experience to help you achieve your fitness goals
        </CardDescription>
        <div className="mt-4">
          <Progress value={setupProgress} className="h-2" />
          <p className="text-xs text-neutral-500 mt-1 text-right">{setupProgress}% Complete</p>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger 
                value="fitness" 
                disabled={!isPersonalInfoComplete}
              >
                Fitness Profile
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                disabled={!isPersonalInfoComplete}
              >
                Preferences
              </TabsTrigger>
            </TabsList>
            
            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              {/* Profile image upload */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative h-24 w-24 mb-4">
                  {profileImage ? (
                    <Image 
                      src={profileImage} 
                      alt="Profile preview" 
                      fill
                      className="rounded-full object-cover border-4 border-primary/20"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center border-4 border-primary/20">
                      <User className="h-12 w-12 text-neutral-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
              
              {/* Personal information fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="firstName"
                      className={`pl-10 ${errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      disabled={isLoading}
                      {...register('firstName')}
                      onChange={(e) => {
                        register('firstName').onChange(e);
                        updateProgress();
                      }}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="lastName"
                      className={`pl-10 ${errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      disabled={isLoading}
                      {...register('lastName')}
                      onChange={(e) => {
                        register('lastName').onChange(e);
                        updateProgress();
                      }}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="phoneNumber"
                      placeholder="(123) 456-7890"
                      className="pl-10"
                      disabled={isLoading}
                      {...register('phoneNumber')}
                      onChange={(e) => {
                        register('phoneNumber').onChange(e);
                        updateProgress();
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="location"
                      placeholder="City, Country"
                      className="pl-10"
                      disabled={isLoading}
                      {...register('location')}
                      onChange={(e) => {
                        register('location').onChange(e);
                        updateProgress();
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a bit about yourself and your fitness journey..."
                    className="resize-none h-24"
                    disabled={isLoading}
                    {...register('bio')}
                    onChange={(e) => {
                      register('bio').onChange(e);
                      updateProgress();
                    }}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio.message}</p>
                  )}
                  <p className="text-xs text-neutral-500 text-right">
                    {watch('bio')?.length || 0}/500 characters
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  type="button" 
                  onClick={nextTab}
                  disabled={!isPersonalInfoComplete}
                >
                  Next: Fitness Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            {/* Fitness Information Tab */}
            <TabsContent value="fitness" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (Optional)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      className="pl-10"
                      disabled={isLoading}
                      {...register('age')}
                      onChange={(e) => {
                        register('age').onChange(e);
                        updateProgress();
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height in cm (Optional)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="height"
                      type="number"
                      placeholder="165"
                      className="pl-10"
                      disabled={isLoading}
                      {...register('height')}
                      onChange={(e) => {
                        register('height').onChange(e);
                        updateProgress();
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight in kg (Optional)</Label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="weight"
                      type="number"
                      placeholder="65"
                      className="pl-10"
                      disabled={isLoading}
                      {...register('weight')}
                      onChange={(e) => {
                        register('weight').onChange(e);
                        updateProgress();
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fitnessLevel">Fitness Level</Label>
                  <Select 
                    onValueChange={(value) => {
                      setValue('fitnessLevel', value as any);
                      updateProgress();
                    }}
                    defaultValue={watch('fitnessLevel')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your fitness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Activity Level</Label>
                  <RadioGroup 
                    defaultValue="moderate" 
                    value={watch('activityLevel')}
                    onValueChange={(value) => {
                      setValue('activityLevel', value as any);
                      updateProgress();
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sedentary" id="sedentary" />
                        <Label htmlFor="sedentary" className="cursor-pointer">Sedentary</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="cursor-pointer">Lightly Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate" className="cursor-pointer">Moderately Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="active" />
                        <Label htmlFor="active" className="cursor-pointer">Very Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very_active" id="very_active" />
                        <Label htmlFor="very_active" className="cursor-pointer">Extremely Active</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Fitness Goal</Label>
                  <RadioGroup 
                    defaultValue="overall_health" 
                    value={watch('fitnessGoal')}
                    onValueChange={(value) => {
                      setValue('fitnessGoal', value as any);
                      updateProgress();
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weight_loss" id="weight_loss" />
                        <Label htmlFor="weight_loss" className="cursor-pointer">Weight Loss</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                        <Label htmlFor="muscle_gain" className="cursor-pointer">Muscle Gain</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maintenance" id="maintenance" />
                        <Label htmlFor="maintenance" className="cursor-pointer">Maintenance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="overall_health" id="overall_health" />
                        <Label htmlFor="overall_health" className="cursor-pointer">Overall Health</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexibility" id="flexibility" />
                        <Label htmlFor="flexibility" className="cursor-pointer">Flexibility</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={previousTab}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  type="button" 
                  onClick={nextTab}
                >
                  Next: Preferences <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <Label className="block mb-3">Preferred Workout Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                      const isSelected = watch('preferredWorkoutDays')?.includes(day);
                      return (
                        <Button
                          key={day}
                          type="button"
                          variant={isSelected ? 'default' : 'outline'}
                          className={`py-1 h-10 ${isSelected ? 'bg-primary' : ''}`}
                          onClick={() => toggleWorkoutDay(day)}
                        >
                          {day.slice(0, 3)}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="workoutDuration">Preferred Workout Duration</Label>
                  <Select 
                    onValueChange={(value) => {
                      setValue('workoutDuration', value);
                      updateProgress();
                    }}
                    defaultValue={watch('workoutDuration')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15-30">15-30 minutes</SelectItem>
                      <SelectItem value="30-45">30-45 minutes</SelectItem>
                      <SelectItem value="45-60">45-60 minutes</SelectItem>
                      <SelectItem value="60+">60+ minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block mb-3">Dietary Restrictions (if any)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo', 'None'].map((restriction) => {
                      const isSelected = watch('dietaryRestrictions')?.includes(restriction);
                      return (
                        <Button
                          key={restriction}
                          type="button"
                          variant={isSelected ? 'default' : 'outline'}
                          className={`py-1 h-10 ${isSelected ? 'bg-primary' : ''}`}
                          onClick={() => toggleDietaryRestriction(restriction)}
                        >
                          {restriction}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={previousTab}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  {isLoading ? 'Saving Profile...' : 'Complete Setup'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-neutral-500">
        You can always update your profile information later from your account settings.
      </CardFooter>
    </Card>
  );
}