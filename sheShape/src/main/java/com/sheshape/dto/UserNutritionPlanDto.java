package com.sheshape.dto;

import com.sheshape.model.UserNutritionPlan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserNutritionPlanDto {
    
    private Long id;
    
    private Long userId;
    
    private Long planId;
    
    private LocalDateTime purchaseDate;
    
    private LocalDateTime expiryDate;
    
    private String status;
    
    private NutritionPlanDto plan;
    
    private UserDto user;
    
    // Constructor from UserNutritionPlan entity
    public UserNutritionPlanDto(UserNutritionPlan userPlan) {
        this.id = userPlan.getId();
        this.userId = userPlan.getUser().getId();
        this.planId = userPlan.getPlan().getId();
        this.purchaseDate = userPlan.getPurchaseDate();
        this.expiryDate = userPlan.getExpiryDate();
        this.status = userPlan.getStatus().name();
        
        if (userPlan.getPlan() != null) {
            this.plan = new NutritionPlanDto(userPlan.getPlan());
        }
        
        if (userPlan.getUser() != null) {
            this.user = new UserDto(userPlan.getUser());
        }
    }
}