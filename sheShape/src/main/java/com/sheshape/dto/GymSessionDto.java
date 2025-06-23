package com.sheshape.dto;

import com.sheshape.model.GymSession;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GymSessionDto {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String videoUrl;
    
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;
    
    @NotNull(message = "Session order is required")
    @Min(value = 1, message = "Session order must be at least 1")
    private Integer sessionOrder;
    
    private Long programId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructor from GymSession entity
    public GymSessionDto(GymSession session) {
        this.id = session.getId();
        this.title = session.getTitle();
        this.description = session.getDescription();
        this.videoUrl = session.getVideoUrl();
        this.durationMinutes = session.getDurationMinutes();
        this.sessionOrder = session.getSessionOrder();
        this.programId = session.getProgram().getId();
        this.createdAt = session.getCreatedAt();
        this.updatedAt = session.getUpdatedAt();
    }
}