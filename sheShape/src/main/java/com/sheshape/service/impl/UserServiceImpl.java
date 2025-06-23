package com.sheshape.service.impl;

import com.sheshape.dto.UserDto;
import com.sheshape.exception.ResourceNotFoundException;
import com.sheshape.model.User;
import com.sheshape.repository.UserRepository;
import com.sheshape.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UsernameNotFoundException("User not authenticated");
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        return new UserDto(user);
    }

    @Override
    public Long getUserIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElse(null);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getAllUsersByRole(User.Role role) {
        return userRepository.findByRole(role).stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        return new UserDto(user);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Update fields
        if (userDto.getUsername() != null) {
            user.setUsername(userDto.getUsername());
        }
        
        if (userDto.getEmail() != null) {
            user.setEmail(userDto.getEmail());
        }
        
        if (userDto.getIsActive() != null) {
            user.setIsActive(userDto.getIsActive());
        }
        
        // Save updated user
        User updatedUser = userRepository.save(user);
        
        return new UserDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        userRepository.delete(user);
    }

    @Override
    public List<UserDto> getPublicTrainers() {
        return userRepository.findByRole(User.Role.TRAINER).stream()
                .filter(User::getIsActive)
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getPublicNutritionists() {
        return userRepository.findByRole(User.Role.NUTRITIONIST).stream()
                .filter(User::getIsActive)
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Long getUserIdByUsernameOrEmail(String username) {
        return userRepository.findByUsernameOrEmail(username,username).map(User::getId).orElse(null);
    }
}