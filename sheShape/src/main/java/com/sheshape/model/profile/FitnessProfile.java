package com.sheshape.model.profile;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "fitness_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FitnessProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "fitness_level")
    private FitnessLevel fitnessLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "primary_goal")
    private FitnessGoal primaryGoal;

    // Store secondary goals as comma-separated values to match frontend
    @Column(name = "secondary_goals", length = 500)
    private String secondaryGoalsRaw;

    // Store preferred activity types as comma-separated values to match frontend
    @Column(name = "preferred_activity_types", length = 500)
    private String preferredActivityTypesRaw;

    // Updated field names to match frontend
    @Column(name = "workout_frequency")
    private Integer workoutFrequency;

    @Column(name = "workout_duration")
    private Integer workoutDuration;

    // Store workout days as comma-separated values
    @Column(name = "preferred_workout_days", length = 200)
    private String preferredWorkoutDaysRaw;

    // Store workout times as comma-separated values
    @Column(name = "preferred_workout_times", length = 500)
    private String preferredWorkoutTimesRaw;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods to convert between List and String storage
    @Transient
    public List<String> getSecondaryGoals() {
        if (secondaryGoalsRaw == null || secondaryGoalsRaw.trim().isEmpty()) {
            return List.of();
        }
        return List.of(secondaryGoalsRaw.split(","));
    }

    public void setSecondaryGoals(List<String> secondaryGoals) {
        if (secondaryGoals == null || secondaryGoals.isEmpty()) {
            this.secondaryGoalsRaw = null;
        } else {
            this.secondaryGoalsRaw = String.join(",", secondaryGoals);
        }
    }

    @Transient
    public List<String> getPreferredActivityTypes() {
        if (preferredActivityTypesRaw == null || preferredActivityTypesRaw.trim().isEmpty()) {
            return List.of();
        }
        return List.of(preferredActivityTypesRaw.split(","));
    }

    public void setPreferredActivityTypes(List<String> preferredActivityTypes) {
        if (preferredActivityTypes == null || preferredActivityTypes.isEmpty()) {
            this.preferredActivityTypesRaw = null;
        } else {
            this.preferredActivityTypesRaw = String.join(",", preferredActivityTypes);
        }
    }

    @Transient
    public List<String> getPreferredWorkoutDays() {
        if (preferredWorkoutDaysRaw == null || preferredWorkoutDaysRaw.trim().isEmpty()) {
            return List.of();
        }
        return List.of(preferredWorkoutDaysRaw.split(","));
    }

    public void setPreferredWorkoutDays(List<String> preferredWorkoutDays) {
        if (preferredWorkoutDays == null || preferredWorkoutDays.isEmpty()) {
            this.preferredWorkoutDaysRaw = null;
        } else {
            this.preferredWorkoutDaysRaw = String.join(",", preferredWorkoutDays);
        }
    }

    @Transient
    public List<String> getPreferredWorkoutTimes() {
        if (preferredWorkoutTimesRaw == null || preferredWorkoutTimesRaw.trim().isEmpty()) {
            return List.of();
        }
        return List.of(preferredWorkoutTimesRaw.split(","));
    }

    public void setPreferredWorkoutTimes(List<String> preferredWorkoutTimes) {
        if (preferredWorkoutTimes == null || preferredWorkoutTimes.isEmpty()) {
            this.preferredWorkoutTimesRaw = null;
        } else {
            this.preferredWorkoutTimesRaw = String.join(",", preferredWorkoutTimes);
        }
    }

    // Keep legacy methods for backward compatibility
    @Deprecated
    @Transient
    public List<FitnessGoal> getFitnessGoals() {
        // This can be mapped from secondaryGoals if needed
        return List.of();
    }

    @Deprecated
    @Transient
    public List<ActivityType> getPreferredActivities() {
        // This can be mapped from preferredActivityTypes if needed
        return List.of();
    }

    @Deprecated
    @Transient
    public Integer getWorkoutFrequencyPerWeek() {
        return workoutFrequency;
    }

    @Deprecated
    public void setWorkoutFrequencyPerWeek(Integer workoutFrequencyPerWeek) {
        this.workoutFrequency = workoutFrequencyPerWeek;
    }

    @Deprecated
    @Transient
    public Integer getPreferredWorkoutDurationMinutes() {
        return workoutDuration;
    }

    @Deprecated
    public void setPreferredWorkoutDurationMinutes(Integer preferredWorkoutDurationMinutes) {
        this.workoutDuration = preferredWorkoutDurationMinutes;
    }

    public enum FitnessLevel {
        BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    }

    public enum FitnessGoal {
        WEIGHT_LOSS, MUSCLE_GAIN, STRENGTH_BUILDING, ENDURANCE,
        FLEXIBILITY, GENERAL_FITNESS, STRESS_RELIEF, REHABILITATION
    }

    public enum ActivityType {
        CARDIO, STRENGTH_TRAINING, YOGA, PILATES, HIIT,
        DANCING, OUTDOOR, SWIMMING, RUNNING, CYCLING, WALKING
    }
}