package com.sheshape.repository.profile;

import com.sheshape.model.profile.HealthInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthInformationRepository extends JpaRepository<HealthInformation, Long> {
    
    Optional<HealthInformation> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
    
    void deleteByUserId(Long userId);
    
    @Query("SELECT hi FROM HealthInformation hi WHERE hi.dietaryRestrictionsRaw IS NOT NULL AND hi.dietaryRestrictionsRaw != ''")
    List<HealthInformation> findUsersWithDietaryRestrictions();
    
    @Query("SELECT hi FROM HealthInformation hi WHERE hi.healthConditionsRaw IS NOT NULL AND hi.healthConditionsRaw != ''")
    List<HealthInformation> findUsersWithHealthConditions();
    
    @Query("SELECT hi FROM HealthInformation hi WHERE hi.emergencyContactName IS NOT NULL")
    List<HealthInformation> findUsersWithEmergencyContact();
}