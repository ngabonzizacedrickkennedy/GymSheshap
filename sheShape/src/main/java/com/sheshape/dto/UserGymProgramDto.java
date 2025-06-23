package com.sheshape.dto;

import com.sheshape.model.UserGymProgram;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserGymProgramDto {
    
    private Long id;
    
    private Long userId;
    
    private Long programId;
    
    private LocalDateTime purchaseDate;
    
    private LocalDateTime expiryDate;
    
    private Long lastWatchedSessionId;
    
    private String status;
    
    private GymProgramDto program;
    
    private UserDto user;
    
    // Constructor from UserGymProgram entity
    public UserGymProgramDto(UserGymProgram userProgram) {
        this.id = userProgram.getId();
        this.userId = userProgram.getUser().getId();
        this.programId = userProgram.getProgram().getId();
        this.purchaseDate = userProgram.getPurchaseDate();
        this.expiryDate = userProgram.getExpiryDate();
        this.lastWatchedSessionId = userProgram.getLastWatchedSessionId();
        this.status = userProgram.getStatus().name();
        
        if (userProgram.getProgram() != null) {
            this.program = new GymProgramDto(userProgram.getProgram());
        }
        
        if (userProgram.getUser() != null) {
            this.user = new UserDto(userProgram.getUser());
        }
    }
}