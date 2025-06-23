package com.sheshape.controller;

import com.sheshape.dto.NutritionPlanDto;
import com.sheshape.dto.UserNutritionPlanDto;
import com.sheshape.service.NutritionPlanService;
import com.sheshape.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionPlanController {

    private final NutritionPlanService nutritionPlanService;
    private final UserService userService;

    public NutritionPlanController(NutritionPlanService nutritionPlanService, UserService userService) {
        this.nutritionPlanService = nutritionPlanService;
        this.userService = userService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<NutritionPlanDto>> getAllActivePlans() {
        return ResponseEntity.ok(nutritionPlanService.getActiveNutritionPlans());
    }
    
    @GetMapping("/plans/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NutritionPlanDto>> getAllPlans() {
        return ResponseEntity.ok(nutritionPlanService.getAllNutritionPlans());
    }
    
    @GetMapping("/plans/{id}")
    public ResponseEntity<NutritionPlanDto> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(nutritionPlanService.getNutritionPlanById(id));
    }
    
    @GetMapping("/nutritionist/{nutritionistId}/plans")
    public ResponseEntity<List<NutritionPlanDto>> getPlansByNutritionist(@PathVariable Long nutritionistId) {
        return ResponseEntity.ok(nutritionPlanService.getNutritionPlansByNutritionist(nutritionistId));
    }
    
    @PostMapping("/plans")
    @PreAuthorize("hasRole('NUTRITIONIST') or hasRole('ADMIN')")
    public ResponseEntity<NutritionPlanDto> createPlan(@Valid @RequestBody NutritionPlanDto planDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(nutritionPlanService.createNutritionPlan(planDto));
    }
    
    @PutMapping("/plans/{id}")
    @PreAuthorize("hasRole('NUTRITIONIST') or hasRole('ADMIN')")
    public ResponseEntity<NutritionPlanDto> updatePlan(
            @PathVariable Long id, 
            @Valid @RequestBody NutritionPlanDto planDto) {
        return ResponseEntity.ok(nutritionPlanService.updateNutritionPlan(id, planDto));
    }
    
    @DeleteMapping("/plans/{id}")
    @PreAuthorize("hasRole('NUTRITIONIST') or hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        nutritionPlanService.deleteNutritionPlan(id);
        return ResponseEntity.noContent().build();
    }
    
    // User nutrition plan endpoints
    
    @GetMapping("/users/{userId}/plans")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId)")
    public ResponseEntity<List<UserNutritionPlanDto>> getUserPlans(@PathVariable Long userId) {
        return ResponseEntity.ok(nutritionPlanService.getUserNutritionPlans(userId));
    }
    
    @GetMapping("/plans/{planId}/users")
    @PreAuthorize("hasRole('NUTRITIONIST') or hasRole('ADMIN')")
    public ResponseEntity<List<UserNutritionPlanDto>> getPlanUsers(@PathVariable Long planId) {
        return ResponseEntity.ok(nutritionPlanService.getUsersForNutritionPlan(planId));
    }
    
    @PostMapping("/users/{userId}/plans/{planId}/purchase")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId)")
    public ResponseEntity<UserNutritionPlanDto> purchasePlan(
            @PathVariable Long userId, 
            @PathVariable Long planId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(nutritionPlanService.purchaseNutritionPlan(userId, planId));
    }
    
    @PutMapping("/users/{userId}/plans/{planId}/status")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId)")
    public ResponseEntity<UserNutritionPlanDto> updateUserPlanStatus(
            @PathVariable Long userId, 
            @PathVariable Long planId, 
            @RequestParam String status) {
        return ResponseEntity.ok(nutritionPlanService.updateUserNutritionPlanStatus(userId, planId, status));
    }
    
    // Current user endpoints for easier client-side usage
    
    @GetMapping("/my-plans")
    public ResponseEntity<List<UserNutritionPlanDto>> getCurrentUserPlans() {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(nutritionPlanService.getUserNutritionPlans(userId));
    }
    
    @PostMapping("/plans/{planId}/purchase")
    public ResponseEntity<UserNutritionPlanDto> purchasePlanCurrentUser(@PathVariable Long planId) {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(nutritionPlanService.purchaseNutritionPlan(userId, planId));
    }
}