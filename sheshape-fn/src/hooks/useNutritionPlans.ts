// src/hooks/useNutritionPlans.ts
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  nutritionService, 
  NutritionPlan, 
  NutritionPlanFormData,
  UserNutritionPlan
} from '@/services/nutritionService';

export function useNutritionPlans(initialFetch: boolean = true) {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all nutrition plans (admin)
  const fetchAllPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await nutritionService.getAllPlans();
      setPlans(data);
      return data;
    } catch (err) {
      const errorMessage = 'Failed to fetch nutrition plans. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching nutrition plans:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only active nutrition plans
  const fetchActivePlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await nutritionService.getActivePlans();
      setPlans(data);
      return data;
    } catch (err) {
      const errorMessage = 'Failed to fetch active nutrition plans. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching active nutrition plans:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single nutrition plan by ID
  const fetchPlanById = async (planId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await nutritionService.getPlanById(planId);
      return data;
    } catch (err) {
      const errorMessage = 'Failed to fetch nutrition plan details. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching nutrition plan:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new nutrition plan
  const createPlan = async (planData: NutritionPlanFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPlan = await nutritionService.createPlan(planData);
      setPlans([...plans, newPlan]);
      toast.success('Nutrition plan created successfully');
      return newPlan;
    } catch (err) {
      const errorMessage = 'Failed to create nutrition plan. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error creating nutrition plan:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing nutrition plan
  const updatePlan = async (planId: number, planData: NutritionPlanFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPlan = await nutritionService.updatePlan(planId, planData);
      setPlans(plans.map(plan => plan.id === planId ? updatedPlan : plan));
      toast.success('Nutrition plan updated successfully');
      return updatedPlan;
    } catch (err) {
      const errorMessage = 'Failed to update nutrition plan. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating nutrition plan:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a nutrition plan
  const deletePlan = async (planId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await nutritionService.deletePlan(planId);
      setPlans(plans.filter(plan => plan.id !== planId));
      toast.success('Nutrition plan deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = 'Failed to delete nutrition plan. It may be associated with active users.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error deleting nutrition plan:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle plan active status
  const togglePlanStatus = async (planId: number, currentStatus: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPlan = currentStatus
        ? await nutritionService.deactivatePlan(planId)
        : await nutritionService.activatePlan(planId);
      
      setPlans(plans.map(plan => plan.id === planId ? updatedPlan : plan));
      toast.success(`Plan ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      return updatedPlan;
    } catch (err) {
      const errorMessage = 'Failed to update plan status. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error toggling plan status:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get users subscribed to a plan
  const getPlanUsers = async (planId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const users = await nutritionService.getPlanUsers(planId);
      return users;
    } catch (err) {
      const errorMessage = 'Failed to fetch plan subscribers. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching plan users:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Update user's plan status
  const updateUserPlanStatus = async (userId: number, planId: number, status: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSubscription = await nutritionService.updateUserPlanStatus(userId, planId, status);
      toast.success(`Subscription ${status.toLowerCase()} successfully`);
      return updatedSubscription;
    } catch (err) {
      const errorMessage = 'Failed to update subscription status. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating subscription status:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch if required
  useEffect(() => {
    if (initialFetch) {
      fetchAllPlans();
    }
  }, [initialFetch]);

  return {
    plans,
    isLoading,
    error,
    fetchAllPlans,
    fetchActivePlans,
    fetchPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    getPlanUsers,
    updateUserPlanStatus
  };
}