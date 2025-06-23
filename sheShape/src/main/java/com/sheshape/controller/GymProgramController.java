package com.sheshape.controller;

import com.sheshape.dto.GymProgramDto;
import com.sheshape.dto.GymSessionDto;
import com.sheshape.dto.UserGymProgramDto;
import com.sheshape.service.GymProgramService;
import com.sheshape.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gym")
public class GymProgramController {

    private final GymProgramService gymProgramService;
    private final UserService userService;

    public GymProgramController(GymProgramService gymProgramService, UserService userService) {
        this.gymProgramService = gymProgramService;
        this.userService = userService;
    }

    @GetMapping("/programs")
    public ResponseEntity<List<GymProgramDto>> getAllActivePrograms() {
        return ResponseEntity.ok(gymProgramService.getActiveGymPrograms());
    }
    
    @GetMapping("/programs/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GymProgramDto>> getAllPrograms() {
        return ResponseEntity.ok(gymProgramService.getAllGymPrograms());
    }
    
    @GetMapping("/programs/{id}")
    public ResponseEntity<GymProgramDto> getProgramById(@PathVariable Long id) {
        return ResponseEntity.ok(gymProgramService.getGymProgramById(id));
    }
    
    @GetMapping("/trainer/{trainerId}/programs")
    public ResponseEntity<List<GymProgramDto>> getProgramsByTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(gymProgramService.getGymProgramsByTrainer(trainerId));
    }
    
    @PostMapping("/programs")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<GymProgramDto> createProgram(@Valid @RequestBody GymProgramDto programDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(gymProgramService.createGymProgram(programDto));
    }
    
    @PutMapping("/programs/{id}")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<GymProgramDto> updateProgram(
            @PathVariable Long id, 
            @Valid @RequestBody GymProgramDto programDto) {
        return ResponseEntity.ok(gymProgramService.updateGymProgram(id, programDto));
    }
    
    @DeleteMapping("/programs/{id}")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        gymProgramService.deleteGymProgram(id);
        return ResponseEntity.noContent().build();
    }
    
    // Session endpoints
    
    @GetMapping("/programs/{programId}/sessions")
    public ResponseEntity<List<GymSessionDto>> getProgramSessions(@PathVariable Long programId) {
        return ResponseEntity.ok(gymProgramService.getSessionsByProgramId(programId));
    }
    
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<GymSessionDto> getSessionById(@PathVariable Long sessionId) {
        return ResponseEntity.ok(gymProgramService.getSessionById(sessionId));
    }
    
    @PostMapping("/programs/{programId}/sessions")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<GymSessionDto> createSession(
            @PathVariable Long programId,
            @Valid @RequestBody GymSessionDto sessionDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(gymProgramService.createSession(programId, sessionDto));
    }
    
    @PutMapping("/sessions/{sessionId}")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<GymSessionDto> updateSession(
            @PathVariable Long sessionId,
            @Valid @RequestBody GymSessionDto sessionDto) {
        return ResponseEntity.ok(gymProgramService.updateSession(sessionId, sessionDto));
    }
    
    @DeleteMapping("/sessions/{sessionId}")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSession(@PathVariable Long sessionId) {
        gymProgramService.deleteSession(sessionId);
        return ResponseEntity.noContent().build();
    }
    
    // User gym program endpoints
    
    @GetMapping("/users/{userId}/programs")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId)")
    public ResponseEntity<List<UserGymProgramDto>> getUserPrograms(@PathVariable Long userId) {
        return ResponseEntity.ok(gymProgramService.getUserGymPrograms(userId));
    }
    
    @GetMapping("/programs/{programId}/users")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<List<UserGymProgramDto>> getProgramUsers(@PathVariable Long programId) {
        return ResponseEntity.ok(gymProgramService.getUsersForGymProgram(programId));
    }
    
    @PostMapping("/users/{userId}/programs/{programId}/purchase")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId)")
    public ResponseEntity<UserGymProgramDto> purchaseProgram(
            @PathVariable Long userId, 
            @PathVariable Long programId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(gymProgramService.purchaseGymProgram(userId, programId));
    }
    
    @PutMapping("/users/{userId}/programs/{programId}/status")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId)")
    public ResponseEntity<UserGymProgramDto> updateUserProgramStatus(
            @PathVariable Long userId, 
            @PathVariable Long programId, 
            @RequestParam String status) {
        return ResponseEntity.ok(gymProgramService.updateUserGymProgramStatus(userId, programId, status));
    }
    
    @PutMapping("/users/{userId}/programs/{programId}/last-watched")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId)")
    public ResponseEntity<UserGymProgramDto> updateLastWatchedSession(
            @PathVariable Long userId, 
            @PathVariable Long programId, 
            @RequestParam Long sessionId) {
        return ResponseEntity.ok(gymProgramService.updateLastWatchedSession(userId, programId, sessionId));
    }
    
    // Current user endpoints for easier client-side usage
    
    @GetMapping("/my-programs")
    public ResponseEntity<List<UserGymProgramDto>> getCurrentUserPrograms() {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(gymProgramService.getUserGymPrograms(userId));
    }
    
    @PostMapping("/programs/{programId}/purchase")
    public ResponseEntity<UserGymProgramDto> purchaseProgramCurrentUser(@PathVariable Long programId) {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(gymProgramService.purchaseGymProgram(userId, programId));
    }
    
    @PutMapping("/programs/{programId}/last-watched")
    public ResponseEntity<UserGymProgramDto> updateLastWatchedSessionCurrentUser(
            @PathVariable Long programId, 
            @RequestParam Long sessionId) {
        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(gymProgramService.updateLastWatchedSession(userId, programId, sessionId));
    }
}