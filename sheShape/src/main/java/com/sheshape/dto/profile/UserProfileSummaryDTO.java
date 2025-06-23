package com.sheshape.dto.profile;

import com.sheshape.model.profile.Profile.Gender;
import com.sheshape.model.profile.FitnessProfile.FitnessLevel;
import com.sheshape.model.profile.FitnessProfile.FitnessGoal;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDate;

@Data
@Builder
public class UserProfileSummaryDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String profilePictureUrl;
    private FitnessLevel fitnessLevel;
    private FitnessGoal primaryGoal;
    private Boolean profileCompleted;
}
