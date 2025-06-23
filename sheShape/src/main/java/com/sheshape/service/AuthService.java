package com.sheshape.service;

import com.sheshape.dto.AuthDTO.AuthRequest;
import com.sheshape.dto.AuthDTO.AuthResponse;
import com.sheshape.dto.AuthDTO.RegistrationRequest;
import com.sheshape.dto.UserDto;

public interface AuthService {
    
    UserDto register(RegistrationRequest registrationRequest);
    
    AuthResponse login(AuthRequest loginRequest);
    
    void logout(String token);
    
    UserDto updatePassword(Long userId, String currentPassword, String newPassword);
}