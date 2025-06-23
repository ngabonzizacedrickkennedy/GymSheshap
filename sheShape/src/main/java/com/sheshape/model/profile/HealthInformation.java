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
@Table(name = "health_information")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // Store as comma-separated values in a single column but expose as List
    @Column(name = "dietary_restrictions", length = 1000)
    private String dietaryRestrictionsRaw;

    @Column(name = "health_conditions", length = 1000)
    private String healthConditionsRaw;

    @Column(name = "medications", length = 500)
    private String medicationsRaw;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods to convert between List and String storage
    @Transient
    public List<String> getDietaryRestrictions() {
        if (dietaryRestrictionsRaw == null || dietaryRestrictionsRaw.trim().isEmpty()) {
            return List.of();
        }
        return List.of(dietaryRestrictionsRaw.split(","));
    }

    public void setDietaryRestrictions(List<String> dietaryRestrictions) {
        if (dietaryRestrictions == null || dietaryRestrictions.isEmpty()) {
            this.dietaryRestrictionsRaw = null;
        } else {
            this.dietaryRestrictionsRaw = String.join(",", dietaryRestrictions);
        }
    }

    @Transient
    public List<String> getHealthConditions() {
        if (healthConditionsRaw == null || healthConditionsRaw.trim().isEmpty()) {
            return List.of();
        }
        return List.of(healthConditionsRaw.split(","));
    }

    public void setHealthConditions(List<String> healthConditions) {
        if (healthConditions == null || healthConditions.isEmpty()) {
            this.healthConditionsRaw = null;
        } else {
            this.healthConditionsRaw = String.join(",", healthConditions);
        }
    }

    @Transient
    public List<String> getMedications() {
        if (medicationsRaw == null || medicationsRaw.trim().isEmpty()) {
            return List.of();
        }
        return List.of(medicationsRaw.split(","));
    }

    public void setMedications(List<String> medications) {
        if (medications == null || medications.isEmpty()) {
            this.medicationsRaw = null;
        } else {
            this.medicationsRaw = String.join(",", medications);
        }
    }
}