package com.sheshape.service.impl;

import com.sheshape.dto.NutritionPlanDto;
import com.sheshape.dto.UserNutritionPlanDto;
import com.sheshape.exception.BadRequestException;
import com.sheshape.exception.ResourceNotFoundException;
import com.sheshape.model.NutritionPlan;
import com.sheshape.model.User;
import com.sheshape.model.UserNutritionPlan;
import com.sheshape.repository.NutritionPlanRepository;
import com.sheshape.repository.UserNutritionPlanRepository;
import com.sheshape.repository.UserRepository;
import com.sheshape.service.NutritionPlanService;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NutritionPlanServiceImpl implements NutritionPlanService {

    private final NutritionPlanRepository nutritionPlanRepository;
    private final UserRepository userRepository;
    private final UserNutritionPlanRepository userNutritionPlanRepository;

    public NutritionPlanServiceImpl(
            NutritionPlanRepository nutritionPlanRepository,
            UserRepository userRepository,
            UserNutritionPlanRepository userNutritionPlanRepository) {
        this.nutritionPlanRepository = nutritionPlanRepository;
        this.userRepository = userRepository;
        this.userNutritionPlanRepository = userNutritionPlanRepository;
    }

    @Override
    public List<NutritionPlanDto> getAllNutritionPlans() {
        return nutritionPlanRepository.findAll().stream()
                .map(NutritionPlanDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<NutritionPlanDto> getActiveNutritionPlans() {
        return nutritionPlanRepository.findByIsActiveTrue().stream()
                .map(NutritionPlanDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public NutritionPlanDto getNutritionPlanById(Long id) {
        NutritionPlan plan = nutritionPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition plan not found with id: " + id));
        
        return new NutritionPlanDto(plan);
    }

    @Override
    public List<NutritionPlanDto> getNutritionPlansByNutritionist(Long nutritionistId) {
        return nutritionPlanRepository.findByNutritionistId(nutritionistId).stream()
                .map(NutritionPlanDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NutritionPlanDto createNutritionPlan(NutritionPlanDto nutritionPlanDto) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User nutritionist = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Ensure the user is a nutritionist
        if (nutritionist.getRole() != User.Role.NUTRITIONIST && nutritionist.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only nutritionists can create nutrition plans");
        }
        
        // Create nutrition plan
        NutritionPlan plan = new NutritionPlan();
        plan.setTitle(nutritionPlanDto.getTitle());
        plan.setDescription(nutritionPlanDto.getDescription());
        plan.setDurationDays(nutritionPlanDto.getDurationDays());
        plan.setPrice(nutritionPlanDto.getPrice());
        plan.setIsActive(nutritionPlanDto.getIsActive() != null ? nutritionPlanDto.getIsActive() : true);
        plan.setNutritionist(nutritionist);
        
        NutritionPlan savedPlan = nutritionPlanRepository.save(plan);
        
        return new NutritionPlanDto(savedPlan);
    }

    @Override
    @Transactional
    public NutritionPlanDto updateNutritionPlan(Long id, NutritionPlanDto nutritionPlanDto) {
        NutritionPlan plan = nutritionPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition plan not found with id: " + id));
        
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Ensure the user is the nutritionist who created the plan or an admin
        if (!plan.getNutritionist().getId().equals(currentUser.getId()) && 
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You cannot update this nutrition plan");
        }
        
        // Update plan
        if (nutritionPlanDto.getTitle() != null) {
            plan.setTitle(nutritionPlanDto.getTitle());
        }
        
        if (nutritionPlanDto.getDescription() != null) {
            plan.setDescription(nutritionPlanDto.getDescription());
        }
        
        if (nutritionPlanDto.getDurationDays() != null) {
            plan.setDurationDays(nutritionPlanDto.getDurationDays());
        }
        
        if (nutritionPlanDto.getPrice() != null) {
            plan.setPrice(nutritionPlanDto.getPrice());
        }
        
        if (nutritionPlanDto.getIsActive() != null) {
            plan.setIsActive(nutritionPlanDto.getIsActive());
        }
        
        NutritionPlan updatedPlan = nutritionPlanRepository.save(plan);
        
        return new NutritionPlanDto(updatedPlan);
    }

    @Override
    @Transactional
    public void deleteNutritionPlan(Long id) {
        NutritionPlan plan = nutritionPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition plan not found with id: " + id));
        
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Ensure the user is the nutritionist who created the plan or an admin
        if (!plan.getNutritionist().getId().equals(currentUser.getId()) && 
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You cannot delete this nutrition plan");
        }
        
        // Check if the plan has any active users
        List<UserNutritionPlan> activeUsers = userNutritionPlanRepository.findByPlanIdAndStatus(
                id, UserNutritionPlan.Status.ACTIVE);
        
        if (!activeUsers.isEmpty()) {
            throw new BadRequestException("Cannot delete a nutrition plan that has active users");
        }
        
        nutritionPlanRepository.delete(plan);
    }

    @Override
    public List<UserNutritionPlanDto> getUserNutritionPlans(Long userId) {
        return userNutritionPlanRepository.findByUserId(userId).stream()
                .map(UserNutritionPlanDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserNutritionPlanDto> getUsersForNutritionPlan(Long planId) {
        return userNutritionPlanRepository.findByPlanId(planId).stream()
                .map(UserNutritionPlanDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserNutritionPlanDto purchaseNutritionPlan(Long userId, Long planId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        NutritionPlan plan = nutritionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition plan not found with id: " + planId));
        
        // Check if the plan is active
        if (!plan.getIsActive()) {
            throw new BadRequestException("This nutrition plan is not available for purchase");
        }
        
        // Check if the user already has this plan
        userNutritionPlanRepository.findByUserIdAndPlanId(userId, planId)
                .ifPresent(existingPlan -> {
                    if (existingPlan.getStatus() == UserNutritionPlan.Status.ACTIVE) {
                        throw new BadRequestException("User already has this nutrition plan");
                    }
                });
        
        // Create user-nutrition plan association
        UserNutritionPlan userPlan = new UserNutritionPlan();
        userPlan.setUser(user);
        userPlan.setPlan(plan);
        userPlan.setPurchaseDate(LocalDateTime.now());
        
        // Set expiry date based on plan duration
        userPlan.setExpiryDate(LocalDateTime.now().plusDays(plan.getDurationDays()));
        
        userPlan.setStatus(UserNutritionPlan.Status.ACTIVE);
        
        UserNutritionPlan savedUserPlan = userNutritionPlanRepository.save(userPlan);
        
        return new UserNutritionPlanDto(savedUserPlan);
    }

    @Override
    @Transactional
    public UserNutritionPlanDto updateUserNutritionPlanStatus(Long userId, Long planId, String status) {
        UserNutritionPlan userPlan = userNutritionPlanRepository.findByUserIdAndPlanId(userId, planId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User-nutrition plan association not found for user id: " + userId + " and plan id: " + planId));
        
        // Update status
        try {
            UserNutritionPlan.Status newStatus = UserNutritionPlan.Status.valueOf(status.toUpperCase());
            userPlan.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }
        
        UserNutritionPlan updatedUserPlan = userNutritionPlanRepository.save(userPlan);
        
        return new UserNutritionPlanDto(updatedUserPlan);
    }
}