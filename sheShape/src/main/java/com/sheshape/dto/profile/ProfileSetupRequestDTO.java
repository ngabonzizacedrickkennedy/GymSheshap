package com.sheshape.dto.profile;

import com.sheshape.model.profile.Profile.Gender;
import com.sheshape.model.profile.FitnessProfile.FitnessLevel;
import com.sheshape.model.profile.FitnessProfile.FitnessGoal;
import com.sheshape.model.profile.FitnessProfile.ActivityType;
import com.sheshape.model.profile.UserPreferences.PrivacyLevel;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProfileSetupRequestDTO {

    // Basic Profile Information
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private Gender gender;

//    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid phone number")
    private String phoneNumber;

    // Physical Attributes
    @Min(value = 100, message = "Height must be at least 100 cm")
    @Max(value = 250, message = "Height must not exceed 250 cm")
    private Integer heightCm;

    @DecimalMin(value = "30.0", message = "Weight must be at least 30 kg")
    @DecimalMax(value = "300.0", message = "Weight must not exceed 300 kg")
    private Double currentWeightKg;

    @DecimalMin(value = "30.0", message = "Target weight must be at least 30 kg")
    @DecimalMax(value = "300.0", message = "Target weight must not exceed 300 kg")
    private Double targetWeightKg;

    // Fitness Information
    private FitnessLevel fitnessLevel;
    private FitnessGoal primaryGoal;

    // Updated to match frontend field names
    @Size(max = 5, message = "You can select up to 5 secondary goals")
    private List<String> secondaryGoals;

    // Updated to match frontend field names and use String list instead of enum
    @Size(max = 10, message = "You can select up to 10 preferred activities")
    private List<String> preferredActivityTypes;

    // Updated field name to match frontend
    @Min(value = 1, message = "Workout frequency must be at least 1 per week")
    @Max(value = 7, message = "Workout frequency cannot exceed 7 per week")
    private Integer workoutFrequency;

    // Updated field name to match frontend
    @Min(value = 15, message = "Workout duration must be at least 15 minutes")
    @Max(value = 180, message = "Workout duration cannot exceed 180 minutes")
    private Integer workoutDuration;

    // Updated to List to match frontend
    private List<String> preferredWorkoutDays;

    // Updated to List to match frontend
    private List<String> preferredWorkoutTimes;

    // Health Information - Updated to List to match frontend
    @Size(max = 20, message = "You can select up to 20 dietary restrictions")
    private List<String> dietaryRestrictions;

    @Size(max = 20, message = "You can select up to 20 health conditions")
    private List<String> healthConditions;

    @Size(max = 50, message = "You can list up to 50 medications")
    private List<String> medications;

    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    private String emergencyContactName;

//    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid emergency contact phone")
    private String emergencyContactPhone;

    // Preferences
    private String timezone;

    @Pattern(regexp = "^[a-z]{2}$", message = "Language must be a valid 2-letter language code")
    private String language;

    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private PrivacyLevel privacyLevel;
}