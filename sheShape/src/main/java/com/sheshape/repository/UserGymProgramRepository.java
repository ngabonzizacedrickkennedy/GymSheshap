package com.sheshape.repository;

import com.sheshape.model.UserGymProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGymProgramRepository extends JpaRepository<UserGymProgram, Long> {

    List<UserGymProgram> findByUserId(Long userId);

    List<UserGymProgram> findByProgramId(Long programId);

    Optional<UserGymProgram> findByUserIdAndProgramId(Long userId, Long programId);

    List<UserGymProgram> findByUserIdAndStatus(Long userId, UserGymProgram.Status status);

    List<UserGymProgram> findByProgramIdAndStatus(Long programId, UserGymProgram.Status status);
}
