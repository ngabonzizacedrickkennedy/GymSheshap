//package com.sheshape.service.impl;
//
//import com.sheshape.dto.ProfileDto;
//import com.sheshape.exception.BadRequestException;
//import com.sheshape.exception.ResourceNotFoundException;
//import com.sheshape.model.Profile;
//import com.sheshape.model.User;
//import com.sheshape.repository.ProfileRepository;
//import com.sheshape.repository.UserRepository;
//import com.sheshape.service.ProfileService;
//import jakarta.transaction.Transactional;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.util.UUID;
//
//@Service
//public class ProfileServiceImpl implements ProfileService {
//
//    private final ProfileRepository profileRepository;
//    private final UserRepository userRepository;
//    private final String uploadDir = "uploads/profile-images/";
//
//    public ProfileServiceImpl(ProfileRepository profileRepository, UserRepository userRepository) {
//        this.profileRepository = profileRepository;
//        this.userRepository = userRepository;
//
//        // Create upload directory if it doesn't exist
//        try {
//            Files.createDirectories(Paths.get(uploadDir));
//        } catch (IOException e) {
//            throw new RuntimeException("Could not create upload directory", e);
//        }
//    }
//
//    @Override
//    public ProfileDto getProfileByUserId(Long userId) {
//        Profile profile = profileRepository.findByUserId(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));
//
//        return new ProfileDto(profile);
//    }
//
//    @Override
//    @Transactional
//    public ProfileDto updateProfile(Long userId, ProfileDto profileDto) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        Profile profile = profileRepository.findByUserId(userId)
//                .orElseGet(() -> {
//                    Profile newProfile = new Profile();
//                    newProfile.setUser(user);
//                    return newProfile;
//                });
//
//        // Update fields
//        if (profileDto.getFirstName() != null) {
//            profile.setFirstName(profileDto.getFirstName());
//        }
//
//        if (profileDto.getLastName() != null) {
//            profile.setLastName(profileDto.getLastName());
//        }
//
//        if (profileDto.getBio() != null) {
//            profile.setBio(profileDto.getBio());
//        }
//
//        if (profileDto.getPhoneNumber() != null) {
//            profile.setPhoneNumber(profileDto.getPhoneNumber());
//        }
//
//        // Save updated profile
//        Profile updatedProfile = profileRepository.save(profile);
//
//        return new ProfileDto(updatedProfile);
//    }
//
//    @Override
//    @Transactional
//    public String uploadProfileImage(Long userId, MultipartFile file) {
//        if (file.isEmpty()) {
//            throw new BadRequestException("File cannot be empty");
//        }
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        Profile profile = profileRepository.findByUserId(userId)
//                .orElseGet(() -> {
//                    Profile newProfile = new Profile();
//                    newProfile.setUser(user);
//                    return profileRepository.save(newProfile);
//                });
//
//        try {
//            // Generate unique filename
//            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//            Path targetLocation = Paths.get(uploadDir + filename);
//
//            // Copy file to upload directory
//            Files.copy(file.getInputStream(), targetLocation);
//
//            // Update profile with image URL
//            profile.setProfileImage(filename);
//            profileRepository.save(profile);
//
//            return filename;
//        } catch (IOException ex) {
//            throw new RuntimeException("Could not store file", ex);
//        }
//    }
//
//    @Override
//    @Transactional
//    public void deleteProfileImage(Long userId) {
//        Profile profile = profileRepository.findByUserId(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));
//
//        String filename = profile.getProfileImage();
//
//        if (filename != null && !filename.isEmpty()) {
//            try {
//                // Delete file from upload directory
//                Path filePath = Paths.get(uploadDir + filename);
//                Files.deleteIfExists(filePath);
//
//                // Update profile
//                profile.setProfileImage(null);
//                profileRepository.save(profile);
//            } catch (IOException ex) {
//                throw new RuntimeException("Could not delete file", ex);
//            }
//        }
//    }
//}