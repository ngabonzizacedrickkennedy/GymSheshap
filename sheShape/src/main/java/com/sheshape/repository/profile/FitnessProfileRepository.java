package com.sheshape.repository.profile;

import com.sheshape.model.profile.FitnessProfile;
import com.sheshape.model.profile.FitnessProfile.FitnessLevel;
import com.sheshape.model.profile.FitnessProfile.FitnessGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FitnessProfileRepository extends JpaRepository<FitnessProfile, Long> {

    Optional<FitnessProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    void deleteByUserId(Long userId);

    @Query("SELECT fp FROM FitnessProfile fp WHERE fp.fitnessLevel = :level")
    List<FitnessProfile> findByFitnessLevel(@Param("level") FitnessLevel level);

    @Query("SELECT fp FROM FitnessProfile fp WHERE fp.primaryGoal = :goal")
    List<FitnessProfile> findByPrimaryGoal(@Param("goal") FitnessGoal goal);

    // Fixed query to use the correct field name
    @Query("SELECT fp FROM FitnessProfile fp WHERE fp.workoutFrequency >= :minFrequency")
    List<FitnessProfile> findByMinWorkoutFrequency(@Param("minFrequency") Integer minFrequency);

    // Additional queries using the new field names
    @Query("SELECT fp FROM FitnessProfile fp WHERE fp.workoutDuration >= :minDuration")
    List<FitnessProfile> findByMinWorkoutDuration(@Param("minDuration") Integer minDuration);

    @Query("SELECT fp FROM FitnessProfile fp WHERE fp.workoutFrequency = :frequency")
    List<FitnessProfile> findByWorkoutFrequency(@Param("frequency") Integer frequency);

    @Query("SELECT fp FROM FitnessProfile fp WHERE fp.workoutDuration = :duration")
    List<FitnessProfile> findByWorkoutDuration(@Param("duration") Integer duration);
}