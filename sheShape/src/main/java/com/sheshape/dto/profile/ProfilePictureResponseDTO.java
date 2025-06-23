package com.sheshape.dto.profile;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ProfilePictureResponseDTO {
    private String profilePictureUrl;
    private String fileName;
    private Long fileSize;
    private String contentType;
    private String uploadedAt;
}
