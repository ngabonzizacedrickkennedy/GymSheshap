// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dumbbell,
  Utensils,
  TrendingUp,
  Award,
  Target,
  Clock,
  PlayCircle,
  ArrowRight,
  Heart
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - in a real app, this would come from API
  const stats = {
    totalWorkouts: 24,
    weekStreak: 5,
    caloriesBurned: 1240,
    minutesExercised: 320
  };

  const recentPrograms = [
    {
      id: 1,
      title: "Total Body Transformation",
      progress: 65,
      lastSession: "Upper Body Strength",
      nextSession: "Cardio Blast",
      image: "/images/programs/program-1.jpg"
    },
    {
      id: 2,
      title: "Yoga Flow & Flexibility",
      progress: 40,
      lastSession: "Morning Stretch",
      nextSession: "Deep Relaxation",
      image: "/images/programs/program-3.jpg"
    }
  ];

  const nutritionPlans = [
    {
      id: 1,
      title: "Balanced Nutrition Plan",
      daysLeft: 18,
      progress: 70,
      todaysMeals: 3
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.profile?.firstName || user?.username}! 💪
        </h1>
        <p className="text-primary-100 mb-4">
          Ready to continue your fitness journey? You're doing amazing!
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            <span className="text-sm">{stats.weekStreak} day streak</span>
          </div>
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            <span className="text-sm">{stats.totalWorkouts} workouts completed</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-sm">{stats.minutesExercised} minutes exercised</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Workouts</p>
                <p className="text-2xl font-bold text-primary">{stats.totalWorkouts}</p>
              </div>
              <Dumbbell className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Current Streak</p>
                <p className="text-2xl font-bold text-accent1">{stats.weekStreak} days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent1/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Calories Burned</p>
                <p className="text-2xl font-bold text-secondary">{stats.caloriesBurned}</p>
              </div>
              <Target className="h-8 w-8 text-secondary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Minutes Exercised</p>
                <p className="text-2xl font-bold text-primary">{stats.minutesExercised}</p>
              </div>
              <Clock className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Programs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Dumbbell className="h-5 w-5 mr-2" />
              My Programs
            </CardTitle>
            <CardDescription>
              Continue your fitness journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPrograms.length > 0 ? (
              recentPrograms.map((program) => (
                <div key={program.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{program.title}</h3>
                      <p className="text-sm text-neutral-600">
                        Last: {program.lastSession}
                      </p>
                    </div>
                    <Badge variant="outline">{program.progress}% Complete</Badge>
                  </div>
                  <Progress value={program.progress} className="mb-3" />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-neutral-600">
                      Next: {program.nextSession}
                    </p>
                    <Button size="sm" asChild>
                      <Link href={`/my-programs/${program.id}`}>
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Continue
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No active programs yet</p>
                <Button asChild>
                  <Link href="/programs">Browse Programs</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nutrition Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="h-5 w-5 mr-2" />
              Nutrition Plans
            </CardTitle>
            <CardDescription>
              Stay on track with your nutrition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nutritionPlans.length > 0 ? (
              nutritionPlans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      <p className="text-sm text-neutral-600">
                        {plan.daysLeft} days remaining
                      </p>
                    </div>
                    <Badge variant="outline">{plan.progress}% Complete</Badge>
                  </div>
                  <Progress value={plan.progress} className="mb-3" />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-neutral-600">
                      Today's meals: {plan.todaysMeals}/3
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/my-nutrition/${plan.id}`}>
                        View Plan
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Utensils className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No nutrition plans yet</p>
                <Button asChild>
                  <Link href="/nutrition">Browse Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            What would you like to do today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/programs" className="flex flex-col items-center text-center">
                <Dumbbell className="h-8 w-8 mb-2 text-primary" />
                <span className="font-medium">Browse Programs</span>
                <span className="text-xs text-neutral-500">Find new workouts</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/nutrition" className="flex flex-col items-center text-center">
                <Utensils className="h-8 w-8 mb-2 text-secondary" />
                <span className="font-medium">Nutrition Plans</span>
                <span className="text-xs text-neutral-500">Healthy eating made easy</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/shop" className="flex flex-col items-center text-center">
                <Heart className="h-8 w-8 mb-2 text-accent1" />
                <span className="font-medium">Shop</span>
                <span className="text-xs text-neutral-500">Fitness gear & supplements</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Section */}
      <Card className="bg-gradient-to-r from-accent2/20 to-accent1/20 border-accent1/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Keep up the great work! 🌟</h3>
              <p className="text-neutral-600 mb-4">
                You're {stats.weekStreak} days into your fitness streak. Every workout brings you closer to your goals!
              </p>
              <Button asChild>
                <Link href="/my-programs">
                  Start Today's Workout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl">💪</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}