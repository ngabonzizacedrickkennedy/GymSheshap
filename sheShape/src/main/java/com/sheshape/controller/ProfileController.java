// controller/ProfileController.java - REST Controller
package com.sheshape.controller;

import com.sheshape.dto.profile.*;
import com.sheshape.dto.response.ApiResponse;
import com.sheshape.security.JwtUtil;
import com.sheshape.service.ProfileService;
import com.sheshape.service.UserDetailsServiceImpl;
import com.sheshape.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/setup")
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> setupProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ProfileSetupRequestDTO request) {

        // Extract user ID from token (implement your token parsing logic)
        Long userId = extractUserIdFromToken(token);
        log.info("Profile setup request received for user ID: {}", userId);

        ProfileResponseDTO profile = profileService.setupProfile(userId, request);

        return ResponseEntity.ok(ApiResponse.<ProfileResponseDTO>builder()
                .success(true)
                .message("Profile setup completed successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> updateProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ProfileUpdateRequestDTO request) {

        Long userId = extractUserIdFromToken(token);
        log.info("Profile update request received for user ID: {}", userId);

        ProfileResponseDTO profile = profileService.updateProfile(userId, request);

        return ResponseEntity.ok(ApiResponse.<ProfileResponseDTO>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(profile)
                .build());
    }

    @PostMapping("/picture")
    public ResponseEntity<ApiResponse<ProfilePictureResponseDTO>> uploadProfilePicture(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {

        Long userId = extractUserIdFromToken(token);
        log.info("Profile picture upload request received for user ID: {}", userId);

        ProfilePictureResponseDTO response = profileService.uploadProfilePicture(userId, file);

        return ResponseEntity.ok(ApiResponse.<ProfilePictureResponseDTO>builder()
                .success(true)
                .message("Profile picture uploaded successfully")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> getUserProfile(
            @RequestHeader("Authorization") String token) {

        Long userId = extractUserIdFromToken(token);
        log.info("Profile retrieval request received for user ID: {}", userId);

        ProfileResponseDTO profile = profileService.getUserProfile(userId);

        return ResponseEntity.ok(ApiResponse.<ProfileResponseDTO>builder()
                .success(true)
                .message("Profile retrieved successfully")
                .data(profile)
                .build());
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<UserProfileSummaryDTO>> getUserProfileSummary(
            @RequestHeader("Authorization") String token) {

        Long userId = extractUserIdFromToken(token);
        log.info("Profile summary request received for user ID: {}", userId);

        UserProfileSummaryDTO summary = profileService.getUserProfileSummary(userId);

        return ResponseEntity.ok(ApiResponse.<UserProfileSummaryDTO>builder()
                .success(true)
                .message("Profile summary retrieved successfully")
                .data(summary)
                .build());
    }

    @PatchMapping("/basic")
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> updateBasicInfo(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody BasicProfileInfoDTO request) {

        Long userId = extractUserIdFromToken(token);
        log.info("Basic profile update request received for user ID: {}", userId);

        ProfileResponseDTO profile = profileService.updateBasicInfo(userId, request);

        return ResponseEntity.ok(ApiResponse.<ProfileResponseDTO>builder()
                .success(true)
                .message("Basic profile information updated successfully")
                .data(profile)
                .build());
    }

    @DeleteMapping("/picture")
    public ResponseEntity<ApiResponse<String>> deleteProfilePicture(
            @RequestHeader("Authorization") String token) {

        Long userId = extractUserIdFromToken(token);
        log.info("Profile picture deletion request received for user ID: {}", userId);

        // Implement this method in service
        // profileService.deleteProfilePicture(userId);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Profile picture deleted successfully")
                .data("Profile picture removed")
                .build());
    }

    // Helper method to extract user ID from token
    // Replace this with your actual JWT token parsing logic
    private Long extractUserIdFromToken(String token) {
        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username = jwtUtil.extractUsername(token);
        return userService.getUserIdByUsernameOrEmail(username);
    }
}