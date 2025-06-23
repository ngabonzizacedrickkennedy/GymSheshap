package com.sheshape.service.impl;

import com.sheshape.dto.AuthDTO.AuthRequest;
import com.sheshape.dto.AuthDTO.AuthResponse;
import com.sheshape.dto.AuthDTO.RegistrationRequest;
import com.sheshape.dto.UserDto;
import com.sheshape.exception.BadRequestException;
import com.sheshape.exception.ResourceNotFoundException;
import com.sheshape.model.Authority;
import com.sheshape.model.profile.Profile;
import com.sheshape.model.User;
import com.sheshape.repository.AuthorityRepository;
import com.sheshape.repository.profile.ProfileRepository;
import com.sheshape.repository.UserRepository;
import com.sheshape.security.JwtUtil;
import com.sheshape.service.AuthService;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            AuthorityRepository authorityRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public UserDto register(RegistrationRequest registrationRequest) {
        // Check if username is already taken
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        // Check if email is already in use
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        // Create new user
        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setIsActive(true);

        // Set role based on request or default to CLIENT
        User.Role role;
        if (registrationRequest.getRole() != null) {
            try {
                role = User.Role.valueOf(registrationRequest.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                role = User.Role.CLIENT; // Default to CLIENT if invalid role
            }
        } else {
            role = User.Role.CLIENT; // Default role
        }
        user.setRole(role);

        // Set user authorities
        Set<Authority> authorities = new HashSet<>();
        String roleName = "ROLE_" + role.name();
        
        Authority roleAuthority = authorityRepository.findByName(roleName)
                .orElseGet(() -> {
                    Authority newAuthority = new Authority(roleName);
                    return authorityRepository.save(newAuthority);
                });
        
        authorities.add(roleAuthority);
        user.setAuthorities(authorities);

        // Save user
        User savedUser = userRepository.save(user);

        // Create default profile
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profileRepository.save(profile);

        return new UserDto(savedUser);
    }

    @Override
    public AuthResponse login(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userDetails.getUsername()));
        
        String authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(jwt);
        authResponse.setUsername(user.getUsername());
        authResponse.setEmail(user.getEmail());
        authResponse.setRole(user.getRole().name());
        authResponse.setAuthorities(authorities);
        
        return authResponse;
    }

    @Override
    public void logout(String token) {
        // In a real implementation, you might want to blacklist the token
        // or remove it from a token store
        // This is a simple implementation
    }

    @Override
    @Transactional
    public UserDto updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        // Check if current password matches
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        
        // Update to new password
        user.setPassword(passwordEncoder.encode(newPassword));
        
        User updatedUser = userRepository.save(user);
        
        return new UserDto(updatedUser);
    }
}