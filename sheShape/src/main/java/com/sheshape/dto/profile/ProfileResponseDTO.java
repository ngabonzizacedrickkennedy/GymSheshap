package com.sheshape.dto.profile;

import com.sheshape.model.profile.Profile.Gender;
import com.sheshape.model.profile.FitnessProfile.FitnessLevel;
import com.sheshape.model.profile.FitnessProfile.FitnessGoal;
import com.sheshape.model.profile.FitnessProfile.ActivityType;
import com.sheshape.model.profile.UserPreferences.PrivacyLevel;
import com.sheshape.model.User.Role;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProfileResponseDTO {

    // Profile ID for response
    private Long id;

    // Basic Profile Information
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String phoneNumber;
    private String profilePictureUrl;

    // Physical Attributes
    private Integer heightCm;
    private Double currentWeightKg;
    private Double targetWeightKg;

    // Fitness Information
    private FitnessLevel fitnessLevel;
    private FitnessGoal primaryGoal;

    // Updated to match frontend expectations
    private List<String> secondaryGoals;
    private List<String> preferredActivityTypes;
    private Integer workoutFrequency;
    private Integer workoutDuration;
    private List<String> preferredWorkoutDays;
    private List<String> preferredWorkoutTimes;

    // Health Information - Updated to List
    private List<String> dietaryRestrictions;
    private List<String> healthConditions;
    private List<String> medications;
    private String emergencyContactName;
    private String emergencyContactPhone;

    // Preferences
    private String timezone;
    private String language;
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private PrivacyLevel privacyLevel;

    // Profile completion status
    private Boolean profileCompleted;

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}