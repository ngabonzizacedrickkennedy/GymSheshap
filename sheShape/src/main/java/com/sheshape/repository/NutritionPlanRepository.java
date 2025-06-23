package com.sheshape.repository;

import com.sheshape.model.NutritionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NutritionPlanRepository extends JpaRepository<NutritionPlan, Long> {
    
    List<NutritionPlan> findByNutritionistId(Long nutritionistId);
    
    List<NutritionPlan> findByIsActiveTrue();
    
    List<NutritionPlan> findByNutritionistIdAndIsActiveTrue(Long nutritionistId);
}