// src/services/nutritionService.ts
import { api } from '@/lib/api';

export interface NutritionPlan {
  id: number;
  title: string;
  description: string;
  durationDays: number;
  price: number;
  isActive: boolean;
  nutritionistId: number;
  nutritionist?: {
    id: number;
    username: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    }
  };
  createdAt: string;
  updatedAt: string;
}

export interface NutritionPlanFormData {
  title: string;
  description: string;
  durationDays: number;
  price: number;
  isActive: boolean;
}

export interface UserNutritionPlan {
  id: number;
  userId: number;
  planId: number;
  purchaseDate: string;
  expiryDate: string;
  status: string;
  user?: {
    id: number;
    username: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      profileImage?: string;
    }
  };
  plan?: NutritionPlan;
}

export const nutritionService = {
  // Get all nutrition plans (admin only)
  getAllPlans: async (): Promise<NutritionPlan[]> => {
    const response = await api.get('/api/nutrition/plans/all');
    return response.data;
  },
  
  // Get only active nutrition plans
  getActivePlans: async (): Promise<NutritionPlan[]> => {
    const response = await api.get('/api/nutrition/plans');
    return response.data;
  },
  
  // Get nutrition plan by ID
  getPlanById: async (planId: number): Promise<NutritionPlan> => {
    const response = await api.get(`/api/nutrition/plans/${planId}`);
    return response.data;
  },
  
  // Create a new nutrition plan
  createPlan: async (planData: NutritionPlanFormData): Promise<NutritionPlan> => {
    const response = await api.post('/api/nutrition/plans', planData);
    return response.data;
  },
  
  // Update an existing nutrition plan
  updatePlan: async (planId: number, planData: NutritionPlanFormData): Promise<NutritionPlan> => {
    const response = await api.put(`/api/nutrition/plans/${planId}`, planData);
    return response.data;
  },
  
  // Delete a nutrition plan
  deletePlan: async (planId: number): Promise<void> => {
    await api.delete(`/api/nutrition/plans/${planId}`);
  },
  
  // Activate a nutrition plan
  async activatePlan(planId: number): Promise<NutritionPlan> {
    const response = await api.put(`/api/nutrition/plans/${planId}/activate`);
    return response.data;
  },
  
  // Deactivate a nutrition plan
  async deactivatePlan(planId: number): Promise<NutritionPlan> {
    const response = await api.put(`/api/nutrition/plans/${planId}/deactivate`);
    return response.data;
  },
  
  // Get all users subscribed to a plan
  getPlanUsers: async (planId: number): Promise<UserNutritionPlan[]> => {
    const response = await api.get(`/api/nutrition/plans/${planId}/users`);
    return response.data;
  },
  
  // Get all plans for a specific user
  async getUserPlans(userId: number): Promise<UserNutritionPlan[]> {
    const response = await api.get(`/api/nutrition/users/${userId}/plans`);
    return response.data;
  },
  
  // Purchase a nutrition plan for a user
  async purchasePlan(userId: number, planId: number): Promise<UserNutritionPlan> {
    const response = await api.post(`/api/nutrition/users/${userId}/plans/${planId}/purchase`);
    return response.data;
  },
  
  // Update user's nutrition plan status
  updateUserPlanStatus: async (userId: number, planId: number, status: string): Promise<UserNutritionPlan> => {
    const response = await api.put(`/api/nutrition/users/${userId}/plans/${planId}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};