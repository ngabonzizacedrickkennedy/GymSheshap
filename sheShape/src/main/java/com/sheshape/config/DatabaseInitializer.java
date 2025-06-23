package com.sheshape.config;

import com.sheshape.model.Authority;
import com.sheshape.model.profile.Profile;
import com.sheshape.model.User;
import com.sheshape.repository.AuthorityRepository;
import com.sheshape.repository.profile.ProfileRepository;
import com.sheshape.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            AuthorityRepository authorityRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Initialize authorities if they don't exist
        initializeAuthorities();
        
        // Initialize default users if they don't exist
        initializeDefaultUsers();
    }

    private void initializeAuthorities() {
        // Create basic role authorities if they don't exist
        createAuthorityIfNotFound("ROLE_ADMIN");
        createAuthorityIfNotFound("ROLE_TRAINER");
        createAuthorityIfNotFound("ROLE_NUTRITIONIST");
        createAuthorityIfNotFound("ROLE_CLIENT");
    }

    private void initializeDefaultUsers() {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@sheshape.com")) {
            createAdminUser();
        }
        
        // Create sample trainer if it doesn't exist
        if (!userRepository.existsByEmail("trainer@sheshape.com")) {
            createTrainerUser();
        }
        
        // Create sample nutritionist if it doesn't exist
        if (!userRepository.existsByEmail("nutritionist@sheshape.com")) {
            createNutritionistUser();
        }
    }

    private Authority createAuthorityIfNotFound(String name) {
        return authorityRepository.findByName(name)
                .orElseGet(() -> {
                    Authority authority = new Authority(name);
                    return authorityRepository.save(authority);
                });
    }

    private void createAdminUser() {
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@sheshape.com");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setRole(User.Role.ADMIN);
        adminUser.setIsActive(true);
        
        Set<Authority> authorities = new HashSet<>();
        authorities.add(createAuthorityIfNotFound("ROLE_ADMIN"));
        adminUser.setAuthorities(authorities);
        
        User savedUser = userRepository.save(adminUser);
        
        // Create profile for admin
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setFirstName("Admin");
        profile.setLastName("User");
        profileRepository.save(profile);
    }

    private void createTrainerUser() {
        User trainerUser = new User();
        trainerUser.setUsername("trainer");
        trainerUser.setEmail("trainer@sheshape.com");
        trainerUser.setPassword(passwordEncoder.encode("trainer123"));
        trainerUser.setRole(User.Role.TRAINER);
        trainerUser.setIsActive(true);
        
        Set<Authority> authorities = new HashSet<>();
        authorities.add(createAuthorityIfNotFound("ROLE_TRAINER"));
        trainerUser.setAuthorities(authorities);
        
        User savedUser = userRepository.save(trainerUser);
        
        // Create profile for trainer
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setFirstName("Sarah");
        profile.setLastName("Johnson");
//        profile.setBio("Certified fitness trainer with 5+ years of experience in strength training and HIIT workouts.");
        profileRepository.save(profile);
    }

    private void createNutritionistUser() {
        User nutritionistUser = new User();
        nutritionistUser.setUsername("nutritionist");
        nutritionistUser.setEmail("nutritionist@sheshape.com");
        nutritionistUser.setPassword(passwordEncoder.encode("nutritionist123"));
        nutritionistUser.setRole(User.Role.NUTRITIONIST);
        nutritionistUser.setIsActive(true);
        
        Set<Authority> authorities = new HashSet<>();
        authorities.add(createAuthorityIfNotFound("ROLE_NUTRITIONIST"));
        nutritionistUser.setAuthorities(authorities);
        
        User savedUser = userRepository.save(nutritionistUser);
        
        // Create profile for nutritionist
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setFirstName("Michael");
        profile.setLastName("Chen");
//        profile.setBio("Registered dietitian specializing in weight management and sports nutrition plans.");
        profileRepository.save(profile);
    }
}