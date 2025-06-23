package com.sheshape.service;

import com.sheshape.dto.GymProgramDto;
import com.sheshape.dto.GymSessionDto;
import com.sheshape.dto.UserGymProgramDto;

import java.util.List;

public interface GymProgramService {
    
    // Program management
    List<GymProgramDto> getAllGymPrograms();
    
    List<GymProgramDto> getActiveGymPrograms();
    
    GymProgramDto getGymProgramById(Long id);
    
    List<GymProgramDto> getGymProgramsByTrainer(Long trainerId);
    
    GymProgramDto createGymProgram(GymProgramDto gymProgramDto);
    
    GymProgramDto updateGymProgram(Long id, GymProgramDto gymProgramDto);
    
    void deleteGymProgram(Long id);
    
    // Session management
    List<GymSessionDto> getSessionsByProgramId(Long programId);
    
    GymSessionDto getSessionById(Long sessionId);
    
    GymSessionDto createSession(Long programId, GymSessionDto sessionDto);
    
    GymSessionDto updateSession(Long sessionId, GymSessionDto sessionDto);
    
    void deleteSession(Long sessionId);
    
    // User-Program association
    List<UserGymProgramDto> getUserGymPrograms(Long userId);
    
    List<UserGymProgramDto> getUsersForGymProgram(Long programId);
    
    UserGymProgramDto purchaseGymProgram(Long userId, Long programId);
    
    UserGymProgramDto updateUserGymProgramStatus(Long userId, Long programId, String status);
    
    UserGymProgramDto updateLastWatchedSession(Long userId, Long programId, Long sessionId);
}