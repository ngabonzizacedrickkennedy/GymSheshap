package com.sheshape.dto;

import com.sheshape.model.profile.Profile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDto {

    private Long id;

    private Long userId;

    private String firstName;

    private String lastName;

    private String bio;

    private String profileImage;

    private String phoneNumber;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Constructor from Profile entity
    public ProfileDto(Profile profile) {
        this.id = profile.getId();
        this.userId = profile.getUser().getId();
        this.firstName = profile.getFirstName();
        this.lastName = profile.getLastName();
        this.profileImage = profile.getProfilePictureUrl();
        this.phoneNumber = profile.getPhoneNumber();
        this.createdAt = profile.getCreatedAt();
        this.updatedAt = profile.getUpdatedAt();
    }
}