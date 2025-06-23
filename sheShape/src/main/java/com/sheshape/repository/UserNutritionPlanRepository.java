package com.sheshape.repository;

import com.sheshape.model.UserNutritionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNutritionPlanRepository extends JpaRepository<UserNutritionPlan, Long> {
    
    List<UserNutritionPlan> findByUserId(Long userId);
    
    List<UserNutritionPlan> findByPlanId(Long planId);
    
    Optional<UserNutritionPlan> findByUserIdAndPlanId(Long userId, Long planId);
    
    List<UserNutritionPlan> findByUserIdAndStatus(Long userId, UserNutritionPlan.Status status);
    
    List<UserNutritionPlan> findByPlanIdAndStatus(Long planId, UserNutritionPlan.Status status);
}