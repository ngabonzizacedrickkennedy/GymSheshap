package com.sheshape.repository;

import com.sheshape.model.GymSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GymSessionRepository extends JpaRepository<GymSession, Long> {

    List<GymSession> findByProgramId(Long programId);

    List<GymSession> findByProgramIdOrderBySessionOrderAsc(Long programId);
}
