package com.sheshape.service.impl;

import com.sheshape.dto.GymProgramDto;
import com.sheshape.dto.GymSessionDto;
import com.sheshape.dto.UserGymProgramDto;
import com.sheshape.exception.BadRequestException;
import com.sheshape.exception.ResourceNotFoundException;
import com.sheshape.model.GymProgram;
import com.sheshape.model.GymSession;
import com.sheshape.model.User;
import com.sheshape.model.UserGymProgram;
import com.sheshape.repository.GymProgramRepository;
import com.sheshape.repository.GymSessionRepository;
import com.sheshape.repository.UserGymProgramRepository;
import com.sheshape.repository.UserRepository;
import com.sheshape.service.GymProgramService;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GymProgramServiceImpl implements GymProgramService {
    private final GymProgramRepository gymProgramRepository;
    private final GymSessionRepository gymSessionRepository;
    private final UserRepository userRepository;
    private final UserGymProgramRepository userGymProgramRepository;

    public GymProgramServiceImpl(
            GymProgramRepository gymProgramRepository,
            GymSessionRepository gymSessionRepository,
            UserRepository userRepository,
            UserGymProgramRepository userGymProgramRepository) {
        this.gymProgramRepository = gymProgramRepository;
        this.gymSessionRepository = gymSessionRepository;
        this.userRepository = userRepository;
        this.userGymProgramRepository = userGymProgramRepository;
    }

    @Override
    public List<GymProgramDto> getAllGymPrograms() {
        return gymProgramRepository.findAll().stream()
                .map(GymProgramDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<GymProgramDto> getActiveGymPrograms() {
        return gymProgramRepository.findByIsActiveTrue().stream()
                .map(GymProgramDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public GymProgramDto getGymProgramById(Long id) {
        GymProgram program = gymProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym program not found with id: " + id));

        return new GymProgramDto(program);
    }

    @Override
    public List<GymProgramDto> getGymProgramsByTrainer(Long trainerId) {
        return gymProgramRepository.findByTrainerId(trainerId).stream()
                .map(GymProgramDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public GymProgramDto createGymProgram(GymProgramDto gymProgramDto) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is a trainer
        if (trainer.getRole() != User.Role.TRAINER && trainer.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only trainers can create gym programs");
        }

        // Create program
        GymProgram program = new GymProgram();
        program.setTitle(gymProgramDto.getTitle());
        program.setDescription(gymProgramDto.getDescription());

        // Set difficulty level
        try {
            program.setDifficultyLevel(GymProgram.DifficultyLevel.valueOf(gymProgramDto.getDifficultyLevel()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid difficulty level: " + gymProgramDto.getDifficultyLevel());
        }

        program.setDurationDays(gymProgramDto.getDurationDays());
        program.setPrice(gymProgramDto.getPrice());
        program.setIsActive(gymProgramDto.getIsActive() != null ? gymProgramDto.getIsActive() : true);
        program.setTrainer(trainer);

        GymProgram savedProgram = gymProgramRepository.save(program);

        return new GymProgramDto(savedProgram);
    }

    @Override
    @Transactional
    public GymProgramDto updateGymProgram(Long id, GymProgramDto gymProgramDto) {
        GymProgram program = gymProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym program not found with id: " + id));

        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the trainer who created the program or an admin
        if (!program.getTrainer().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You cannot update this gym program");
        }

        // Update program
        if (gymProgramDto.getTitle() != null) {
            program.setTitle(gymProgramDto.getTitle());
        }

        if (gymProgramDto.getDescription() != null) {
            program.setDescription(gymProgramDto.getDescription());
        }

        if (gymProgramDto.getDifficultyLevel() != null) {
            try {
                program.setDifficultyLevel(GymProgram.DifficultyLevel.valueOf(gymProgramDto.getDifficultyLevel()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid difficulty level: " + gymProgramDto.getDifficultyLevel());
            }
        }

        if (gymProgramDto.getDurationDays() != null) {
            program.setDurationDays(gymProgramDto.getDurationDays());
        }

        if (gymProgramDto.getPrice() != null) {
            program.setPrice(gymProgramDto.getPrice());
        }

        if (gymProgramDto.getIsActive() != null) {
            program.setIsActive(gymProgramDto.getIsActive());
        }

        GymProgram updatedProgram = gymProgramRepository.save(program);

        return new GymProgramDto(updatedProgram);
    }

    @Override
    @Transactional
    public void deleteGymProgram(Long id) {
        GymProgram program = gymProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym program not found with id: " + id));

        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the trainer who created the program or an admin
        if (!program.getTrainer().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You cannot delete this gym program");
        }

        // Check if the program has any active users
        List<UserGymProgram> activeUsers = userGymProgramRepository.findByProgramIdAndStatus(
                id, UserGymProgram.Status.ACTIVE);

        if (!activeUsers.isEmpty()) {
            throw new BadRequestException("Cannot delete a gym program that has active users");
        }

        gymProgramRepository.delete(program);
    }

    @Override
    public List<GymSessionDto> getSessionsByProgramId(Long programId) {
        return gymSessionRepository.findByProgramIdOrderBySessionOrderAsc(programId).stream()
                .map(GymSessionDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public GymSessionDto getSessionById(Long sessionId) {
        GymSession session = gymSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym session not found with id: " + sessionId));

        return new GymSessionDto(session);
    }

    @Override
    @Transactional
    public GymSessionDto createSession(Long programId, GymSessionDto sessionDto) {
        GymProgram program = gymProgramRepository.findById(programId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym program not found with id: " + programId));

        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the trainer who created the program or an admin
        if (!program.getTrainer().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You cannot add sessions to this gym program");
        }

        // Create session
        GymSession session = new GymSession();
        session.setTitle(sessionDto.getTitle());
        session.setDescription(sessionDto.getDescription());
        session.setVideoUrl(sessionDto.getVideoUrl());
        session.setDurationMinutes(sessionDto.getDurationMinutes());
        session.setSessionOrder(sessionDto.getSessionOrder());
        session.setProgram(program);

        GymSession savedSession = gymSessionRepository.save(session);

        return new GymSessionDto(savedSession);
    }

    @Override
    @Transactional
    public GymSessionDto updateSession(Long sessionId, GymSessionDto sessionDto) {
        GymSession session = gymSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym session not found with id: " + sessionId));

        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the trainer who created the program or an admin
        if (!session.getProgram().getTrainer().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You cannot update this gym session");
        }

        // Update session
        if (sessionDto.getTitle() != null) {
            session.setTitle(sessionDto.getTitle());
        }

        if (sessionDto.getDescription() != null) {
            session.setDescription(sessionDto.getDescription());
        }

        if (sessionDto.getVideoUrl() != null) {
            session.setVideoUrl(sessionDto.getVideoUrl());
        }

        if (sessionDto.getDurationMinutes() != null) {
            session.setDurationMinutes(sessionDto.getDurationMinutes());
        }

        if (sessionDto.getSessionOrder() != null) {
            session.setSessionOrder(sessionDto.getSessionOrder());
        }

        GymSession updatedSession = gymSessionRepository.save(session);

        return new GymSessionDto(updatedSession);
    }

    @Override
    @Transactional
    public void deleteSession(Long sessionId) {
        GymSession session = gymSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym session not found with id: " + sessionId));

        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the trainer who created the program or an admin
        if (!session.getProgram().getTrainer().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You cannot delete this gym session");
        }

        gymSessionRepository.delete(session);
    }

    @Override
    public List<UserGymProgramDto> getUserGymPrograms(Long userId) {
        return userGymProgramRepository.findByUserId(userId).stream()
                .map(UserGymProgramDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserGymProgramDto> getUsersForGymProgram(Long programId) {
        return userGymProgramRepository.findByProgramId(programId).stream()
                .map(UserGymProgramDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserGymProgramDto purchaseGymProgram(Long userId, Long programId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        GymProgram program = gymProgramRepository.findById(programId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym program not found with id: " + programId));

        // Check if the program is active
        if (!program.getIsActive()) {
            throw new BadRequestException("This gym program is not available for purchase");
        }

        // Check if the user already has this program
        userGymProgramRepository.findByUserIdAndProgramId(userId, programId)
                .ifPresent(existingProgram -> {
                    if (existingProgram.getStatus() == UserGymProgram.Status.ACTIVE) {
                        throw new BadRequestException("User already has this gym program");
                    }
                });

        // Create user-program association
        UserGymProgram userProgram = new UserGymProgram();
        userProgram.setUser(user);
        userProgram.setProgram(program);
        userProgram.setPurchaseDate(LocalDateTime.now());

        // Set expiry date based on program duration
        userProgram.setExpiryDate(LocalDateTime.now().plusDays(program.getDurationDays()));

        userProgram.setStatus(UserGymProgram.Status.ACTIVE);

        UserGymProgram savedUserProgram = userGymProgramRepository.save(userProgram);

        return new UserGymProgramDto(savedUserProgram);
    }

    @Override
    @Transactional
    public UserGymProgramDto updateUserGymProgramStatus(Long userId, Long programId, String status) {
        UserGymProgram userProgram = userGymProgramRepository.findByUserIdAndProgramId(userId, programId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User-program association not found for user id: " + userId + " and program id: " + programId));

        // Update status
        try {
            UserGymProgram.Status newStatus = UserGymProgram.Status.valueOf(status.toUpperCase());
            userProgram.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        UserGymProgram updatedUserProgram = userGymProgramRepository.save(userProgram);

        return new UserGymProgramDto(updatedUserProgram);
    }

    @Override
    @Transactional
    public UserGymProgramDto updateLastWatchedSession(Long userId, Long programId, Long sessionId) {
        UserGymProgram userProgram = userGymProgramRepository.findByUserIdAndProgramId(userId, programId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User-program association not found for user id: " + userId + " and program id: " + programId));

        // Verify the session exists and belongs to the program
        if (sessionId != null) {
            GymSession session = gymSessionRepository.findById(sessionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Gym session not found with id: " + sessionId));

            if (!session.getProgram().getId().equals(programId)) {
                throw new BadRequestException("Session does not belong to the specified program");
            }
        }

        // Update last watched session
        userProgram.setLastWatchedSessionId(sessionId);
        UserGymProgram updatedUserProgram = userGymProgramRepository.save(userProgram);

        return new UserGymProgramDto(updatedUserProgram);
    }
}