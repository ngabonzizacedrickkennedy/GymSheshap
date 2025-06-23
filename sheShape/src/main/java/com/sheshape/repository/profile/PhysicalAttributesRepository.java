package com.sheshape.repository.profile;

import com.sheshape.model.profile.PhysicalAttributes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhysicalAttributesRepository extends JpaRepository<PhysicalAttributes, Long> {
    
    Optional<PhysicalAttributes> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
    
    void deleteByUserId(Long userId);
}