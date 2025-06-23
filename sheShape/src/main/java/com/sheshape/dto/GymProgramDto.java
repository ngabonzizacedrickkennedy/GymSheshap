package com.sheshape.dto;

import com.sheshape.model.GymProgram;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GymProgramDto {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Difficulty level is required")
    private String difficultyLevel;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;
    
    private Boolean isActive;
    
    private Long trainerId;
    
    private UserDto trainer;
    
    private List<GymSessionDto> sessions = new ArrayList<>();
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructor from GymProgram entity
    public GymProgramDto(GymProgram program) {
        this.id = program.getId();
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.difficultyLevel = program.getDifficultyLevel().name();
        this.durationDays = program.getDurationDays();
        this.price = program.getPrice();
        this.isActive = program.getIsActive();
        this.trainerId = program.getTrainer().getId();
        this.createdAt = program.getCreatedAt();
        this.updatedAt = program.getUpdatedAt();
        
        if (program.getTrainer() != null) {
            this.trainer = new UserDto(program.getTrainer());
        }
        
        if (program.getSessions() != null && !program.getSessions().isEmpty()) {
            this.sessions = program.getSessions().stream()
                    .map(GymSessionDto::new)
                    .collect(Collectors.toList());
        }
    }
}