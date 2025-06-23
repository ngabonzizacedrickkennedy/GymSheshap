package com.sheshape.repository;

import com.sheshape.model.GymProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GymProgramRepository extends JpaRepository<GymProgram, Long> {
    
    List<GymProgram> findByTrainerId(Long trainerId);
    
    List<GymProgram> findByIsActiveTrue();
    
    List<GymProgram> findByTrainerIdAndIsActiveTrue(Long trainerId);
    
    List<GymProgram> findByDifficultyLevel(GymProgram.DifficultyLevel difficultyLevel);
}
