package com.sheshape.dto;

import com.sheshape.model.NutritionPlan;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NutritionPlanDto {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;
    
    private Boolean isActive;
    
    private Long nutritionistId;
    
    private UserDto nutritionist;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructor from NutritionPlan entity
    public NutritionPlanDto(NutritionPlan plan) {
        this.id = plan.getId();
        this.title = plan.getTitle();
        this.description = plan.getDescription();
        this.durationDays = plan.getDurationDays();
        this.price = plan.getPrice();
        this.isActive = plan.getIsActive();
        this.nutritionistId = plan.getNutritionist().getId();
        this.createdAt = plan.getCreatedAt();
        this.updatedAt = plan.getUpdatedAt();
        
        if (plan.getNutritionist() != null) {
            this.nutritionist = new UserDto(plan.getNutritionist());
        }
    }
}