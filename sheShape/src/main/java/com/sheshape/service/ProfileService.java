package com.sheshape.service;

import com.sheshape.dto.profile.*;
import com.sheshape.exception.ResourceNotFoundException;
import com.sheshape.exception.BadRequestException;
import com.sheshape.model.User;
import com.sheshape.model.profile.*;
import com.sheshape.repository.UserRepository;
import com.sheshape.repository.profile.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PhysicalAttributesRepository physicalAttributesRepository;
    private final FitnessProfileRepository fitnessProfileRepository;
    private final HealthInformationRepository healthInformationRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ProfileResponseDTO setupProfile(Long userId, ProfileSetupRequestDTO request) {
        log.info("Setting up profile for user ID: {}", userId);

        User user = getUserById(userId);
        validateProfileSetup(user);

        // Create all profile entities
        Profile profile = createProfile(user, request);
        PhysicalAttributes physicalAttributes = createPhysicalAttributes(userId, request);
        FitnessProfile fitnessProfile = createFitnessProfile(userId, request);
        HealthInformation healthInformation = createHealthInformation(userId, request);
        UserPreferences userPreferences = createUserPreferences(userId, request);

        // Save all entities

        if (physicalAttributes != null) {
            physicalAttributesRepository.save(physicalAttributes);
        }
        if (fitnessProfile != null) {
            fitnessProfileRepository.save(fitnessProfile);
        }
        if (healthInformation != null) {
            healthInformationRepository.save(healthInformation);
        }
        if (userPreferences != null) {
            userPreferencesRepository.save(userPreferences);
        }

        if(profileRepository.existsByUserId(userId)){
            log.info("Id: {} already exists in profile setup",userId);
            Profile existingProfile = profileRepository.findByUserId(userId).orElse(profile);
            profile.setProfilePictureUrl(existingProfile.getProfilePictureUrl());
            profile.setId(existingProfile.getId());
            profile.setCreatedAt(existingProfile.getCreatedAt());
        }
        profile = profileRepository.save(profile);

        // Mark profile as completed
        user.setProfileCompleted(true);
        userRepository.save(user);

        log.info("Profile setup completed for user ID: {}", userId);
        return buildProfileResponse(user, profile, physicalAttributes, fitnessProfile,
                healthInformation, userPreferences);
    }

    @Transactional
    public ProfileResponseDTO updateProfile(Long userId, ProfileUpdateRequestDTO request) {
        log.info("Updating profile for user ID: {}", userId);

        User user = getUserById(userId);

        // Update or create profile entities
        Profile profile = updateProfile(user, request);
        PhysicalAttributes physicalAttributes = updatePhysicalAttributes(userId, request);
        FitnessProfile fitnessProfile = updateFitnessProfile(userId, request);
        HealthInformation healthInformation = updateHealthInformation(userId, request);
        UserPreferences userPreferences = updateUserPreferences(userId, request);

        log.info("Profile updated for user ID: {}", userId);
        return buildProfileResponse(user, profile, physicalAttributes, fitnessProfile,
                healthInformation, userPreferences);
    }

    @Transactional
    public ProfilePictureResponseDTO uploadProfilePicture(Long userId, MultipartFile file) {
        log.info("Uploading profile picture for user ID: {}", userId);

        validateProfilePictureFile(file);

        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        // Delete old profile picture if exists
        if (profile.getProfilePictureUrl() != null) {
            fileStorageService.deleteFile(profile.getProfilePictureUrl());
        }

        // Upload new profile picture
        String fileName = fileStorageService.uploadFile(file, "profile-pictures");
        String fileUrl = fileStorageService.getFileUrl(fileName);

        profile.setProfilePictureUrl(fileUrl);
        profileRepository.save(profile);

        log.info("Profile picture uploaded successfully for user ID: {}", userId);

        return ProfilePictureResponseDTO.builder()
                .profilePictureUrl(fileUrl)
                .fileName(fileName)
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .uploadedAt(LocalDateTime.now().toString())
                .build();

    }

    @Transactional(readOnly = true)
    public ProfileResponseDTO getUserProfile(Long userId) {
        log.info("Retrieving profile for user ID: {}", userId);

        User user = getUserById(userId);
        Profile profile = profileRepository.findByUserId(userId).orElse(null);
        PhysicalAttributes physicalAttributes = physicalAttributesRepository.findByUserId(userId).orElse(null);
        FitnessProfile fitnessProfile = fitnessProfileRepository.findByUserId(userId).orElse(null);
        HealthInformation healthInformation = healthInformationRepository.findByUserId(userId).orElse(null);
        UserPreferences userPreferences = userPreferencesRepository.findByUserId(userId).orElse(null);

        return buildProfileResponse(user, profile, physicalAttributes, fitnessProfile,
                healthInformation, userPreferences);
    }

    @Transactional(readOnly = true)
    public UserProfileSummaryDTO getUserProfileSummary(Long userId) {
        log.info("Retrieving profile summary for user ID: {}", userId);

        User user = getUserById(userId);
        Profile profile = profileRepository.findByUserId(userId).orElse(null);
        FitnessProfile fitnessProfile = fitnessProfileRepository.findByUserId(userId).orElse(null);

        return UserProfileSummaryDTO.builder()
                .userId(user.getId())
                .firstName(profile != null ? profile.getFirstName() : null)
                .lastName(profile != null ? profile.getLastName() : null)
                .dateOfBirth(profile != null ? profile.getDateOfBirth() : null)
                .gender(profile != null ? profile.getGender() : null)
                .profilePictureUrl(profile != null ? profile.getProfilePictureUrl() : null)
                .fitnessLevel(fitnessProfile != null ? fitnessProfile.getFitnessLevel() : null)
                .primaryGoal(fitnessProfile != null ? fitnessProfile.getPrimaryGoal() : null)
                .profileCompleted(user.getProfileCompleted())
                .build();
    }

    @Transactional
    public ProfileResponseDTO updateBasicInfo(Long userId, BasicProfileInfoDTO request) {
        log.info("Updating basic info for user ID: {}", userId);

        User user = getUserById(userId);
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setPhoneNumber(request.getPhoneNumber());

        profileRepository.save(profile);

        return getUserProfile(userId);
    }

    // Private helper methods
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    private void validateProfileSetup(User user) {
        if (user.getProfileCompleted() != null && user.getProfileCompleted()) {
            throw new BadRequestException("Profile has already been completed");
        }
    }

    private void validateProfilePictureFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size must not exceed 5MB");
        }
    }

    private Profile createProfile(User user, ProfileSetupRequestDTO request) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setPhoneNumber(request.getPhoneNumber());
        return profile;
    }

    private Profile updateProfile(User user, ProfileUpdateRequestDTO request) {
        Profile profile = profileRepository.findByUserId(user.getId()).orElse(new Profile());
        profile.setUser(user);

        if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
        if (request.getLastName() != null) profile.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getPhoneNumber() != null) profile.setPhoneNumber(request.getPhoneNumber());

        return profileRepository.save(profile);
    }

    private PhysicalAttributes createPhysicalAttributes(Long userId, ProfileSetupRequestDTO request) {
        if (request.getHeightCm() == null && request.getCurrentWeightKg() == null && request.getTargetWeightKg() == null) {
            return null;
        }

        PhysicalAttributes attributes = new PhysicalAttributes();
        attributes.setUserId(userId);
        attributes.setHeightCm(request.getHeightCm());
        attributes.setCurrentWeightKg(request.getCurrentWeightKg());
        attributes.setTargetWeightKg(request.getTargetWeightKg());
        return attributes;
    }

    private PhysicalAttributes updatePhysicalAttributes(Long userId, ProfileUpdateRequestDTO request) {
        PhysicalAttributes attributes = physicalAttributesRepository.findByUserId(userId)
                .orElse(new PhysicalAttributes());

        attributes.setUserId(userId);
        if (request.getHeightCm() != null) attributes.setHeightCm(request.getHeightCm());
        if (request.getCurrentWeightKg() != null) attributes.setCurrentWeightKg(request.getCurrentWeightKg());
        if (request.getTargetWeightKg() != null) attributes.setTargetWeightKg(request.getTargetWeightKg());

        return physicalAttributesRepository.save(attributes);
    }

    private FitnessProfile createFitnessProfile(Long userId, ProfileSetupRequestDTO request) {
        if (request.getFitnessLevel() == null && request.getPrimaryGoal() == null) {
            return null;
        }

        FitnessProfile fitness = new FitnessProfile();
        fitness.setUserId(userId);
        fitness.setFitnessLevel(request.getFitnessLevel());
        fitness.setPrimaryGoal(request.getPrimaryGoal());

        // Handle new field names and types
        fitness.setSecondaryGoals(request.getSecondaryGoals());
        fitness.setPreferredActivityTypes(request.getPreferredActivityTypes());
        fitness.setWorkoutFrequency(request.getWorkoutFrequency());
        fitness.setWorkoutDuration(request.getWorkoutDuration());
        fitness.setPreferredWorkoutDays(request.getPreferredWorkoutDays());
        fitness.setPreferredWorkoutTimes(request.getPreferredWorkoutTimes());

        return fitness;
    }

    private FitnessProfile updateFitnessProfile(Long userId, ProfileUpdateRequestDTO request) {
        FitnessProfile fitness = fitnessProfileRepository.findByUserId(userId)
                .orElse(new FitnessProfile());

        fitness.setUserId(userId);
        if (request.getFitnessLevel() != null) fitness.setFitnessLevel(request.getFitnessLevel());
        if (request.getPrimaryGoal() != null) fitness.setPrimaryGoal(request.getPrimaryGoal());

        // Handle new field names and types
        if (request.getSecondaryGoals() != null) fitness.setSecondaryGoals(request.getSecondaryGoals());
        if (request.getPreferredActivityTypes() != null) fitness.setPreferredActivityTypes(request.getPreferredActivityTypes());
        if (request.getWorkoutFrequency() != null) fitness.setWorkoutFrequency(request.getWorkoutFrequency());
        if (request.getWorkoutDuration() != null) fitness.setWorkoutDuration(request.getWorkoutDuration());
        if (request.getPreferredWorkoutDays() != null) fitness.setPreferredWorkoutDays(request.getPreferredWorkoutDays());
        if (request.getPreferredWorkoutTimes() != null) fitness.setPreferredWorkoutTimes(request.getPreferredWorkoutTimes());

        return fitnessProfileRepository.save(fitness);
    }

    private HealthInformation createHealthInformation(Long userId, ProfileSetupRequestDTO request) {
        if (request.getDietaryRestrictions() == null && request.getHealthConditions() == null &&
                request.getEmergencyContactName() == null) {
            return null;
        }

        HealthInformation health = new HealthInformation();
        health.setUserId(userId);

        // Handle list types
        health.setDietaryRestrictions(request.getDietaryRestrictions());
        health.setHealthConditions(request.getHealthConditions());
        health.setMedications(request.getMedications());
        health.setEmergencyContactName(request.getEmergencyContactName());
        health.setEmergencyContactPhone(request.getEmergencyContactPhone());

        return health;
    }
    private HealthInformation updateHealthInformation(Long userId, ProfileUpdateRequestDTO request) {
        HealthInformation health = healthInformationRepository.findByUserId(userId)
                .orElse(new HealthInformation());

        health.setUserId(userId);

        // Handle list types
        if (request.getDietaryRestrictions() != null) health.setDietaryRestrictions(request.getDietaryRestrictions());
        if (request.getHealthConditions() != null) health.setHealthConditions(request.getHealthConditions());
        if (request.getMedications() != null) health.setMedications(request.getMedications());
        if (request.getEmergencyContactName() != null) health.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null) health.setEmergencyContactPhone(request.getEmergencyContactPhone());

        return healthInformationRepository.save(health);
    }
    private UserPreferences createUserPreferences(Long userId, ProfileSetupRequestDTO request) {
        UserPreferences preferences = new UserPreferences();
        preferences.setUserId(userId);
        preferences.setTimezone(request.getTimezone());
        preferences.setLanguage(request.getLanguage() != null ? request.getLanguage() : "en");
        preferences.setEmailNotifications(request.getEmailNotifications() != null ? request.getEmailNotifications() : true);
        preferences.setPushNotifications(request.getPushNotifications() != null ? request.getPushNotifications() : true);
        preferences.setPrivacyLevel(request.getPrivacyLevel() != null ? request.getPrivacyLevel() : UserPreferences.PrivacyLevel.PRIVATE);
        return preferences;
    }

    private UserPreferences updateUserPreferences(Long userId, ProfileUpdateRequestDTO request) {
        UserPreferences preferences = userPreferencesRepository.findByUserId(userId)
                .orElse(new UserPreferences());

        preferences.setUserId(userId);
        if (request.getTimezone() != null) preferences.setTimezone(request.getTimezone());
        if (request.getLanguage() != null) preferences.setLanguage(request.getLanguage());
        if (request.getEmailNotifications() != null) preferences.setEmailNotifications(request.getEmailNotifications());
        if (request.getPushNotifications() != null) preferences.setPushNotifications(request.getPushNotifications());
        if (request.getPrivacyLevel() != null) preferences.setPrivacyLevel(request.getPrivacyLevel());

        return userPreferencesRepository.save(preferences);
    }

    private ProfileResponseDTO buildProfileResponse(User user, Profile profile,
                                                    PhysicalAttributes physicalAttributes,
                                                    FitnessProfile fitnessProfile,
                                                    HealthInformation healthInformation,
                                                    UserPreferences userPreferences) {

        ProfileResponseDTO.ProfileResponseDTOBuilder builder = ProfileResponseDTO.builder()
                .profileCompleted(user.getProfileCompleted());

        // Basic Profile Information
        if (profile != null) {
            builder.id(profile.getId())
                    .firstName(profile.getFirstName())
                    .lastName(profile.getLastName())
                    .dateOfBirth(profile.getDateOfBirth())
                    .gender(profile.getGender())
                    .phoneNumber(profile.getPhoneNumber())
                    .profilePictureUrl(profile.getProfilePictureUrl())
                    .createdAt(profile.getCreatedAt())
                    .updatedAt(profile.getUpdatedAt());
        }

        // Physical Attributes
        if (physicalAttributes != null) {
            builder.heightCm(physicalAttributes.getHeightCm())
                    .currentWeightKg(physicalAttributes.getCurrentWeightKg())
                    .targetWeightKg(physicalAttributes.getTargetWeightKg());
        }

        // Fitness Information
        if (fitnessProfile != null) {
            builder.fitnessLevel(fitnessProfile.getFitnessLevel())
                    .primaryGoal(fitnessProfile.getPrimaryGoal())
                    .secondaryGoals(fitnessProfile.getSecondaryGoals())
                    .preferredActivityTypes(fitnessProfile.getPreferredActivityTypes())
                    .workoutFrequency(fitnessProfile.getWorkoutFrequency())
                    .workoutDuration(fitnessProfile.getWorkoutDuration())
                    .preferredWorkoutDays(fitnessProfile.getPreferredWorkoutDays())
                    .preferredWorkoutTimes(fitnessProfile.getPreferredWorkoutTimes());
        }

        // Health Information
        if (healthInformation != null) {
            builder.dietaryRestrictions(healthInformation.getDietaryRestrictions())
                    .healthConditions(healthInformation.getHealthConditions())
                    .medications(healthInformation.getMedications())
                    .emergencyContactName(healthInformation.getEmergencyContactName())
                    .emergencyContactPhone(healthInformation.getEmergencyContactPhone());
        }

        // User Preferences
        if (userPreferences != null) {
            builder.timezone(userPreferences.getTimezone())
                    .language(userPreferences.getLanguage())
                    .emailNotifications(userPreferences.getEmailNotifications())
                    .pushNotifications(userPreferences.getPushNotifications())
                    .privacyLevel(userPreferences.getPrivacyLevel());
        }

        return builder.build();
    }
}