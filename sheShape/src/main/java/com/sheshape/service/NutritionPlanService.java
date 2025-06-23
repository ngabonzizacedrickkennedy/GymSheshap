package com.sheshape.service;

import com.sheshape.dto.NutritionPlanDto;
import com.sheshape.dto.UserNutritionPlanDto;

import java.util.List;

public interface NutritionPlanService {
    
    List<NutritionPlanDto> getAllNutritionPlans();
    
    List<NutritionPlanDto> getActiveNutritionPlans();
    
    NutritionPlanDto getNutritionPlanById(Long id);
    
    List<NutritionPlanDto> getNutritionPlansByNutritionist(Long nutritionistId);
    
    NutritionPlanDto createNutritionPlan(NutritionPlanDto nutritionPlanDto);
    
    NutritionPlanDto updateNutritionPlan(Long id, NutritionPlanDto nutritionPlanDto);
    
    void deleteNutritionPlan(Long id);
    
    // Methods for user-nutrition plan association
    List<UserNutritionPlanDto> getUserNutritionPlans(Long userId);
    
    List<UserNutritionPlanDto> getUsersForNutritionPlan(Long planId);
    
    UserNutritionPlanDto purchaseNutritionPlan(Long userId, Long planId);
    
    UserNutritionPlanDto updateUserNutritionPlanStatus(Long userId, Long planId, String status);
}