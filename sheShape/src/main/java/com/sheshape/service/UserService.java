package com.sheshape.service;

import com.sheshape.dto.UserDto;
import com.sheshape.model.User;

import java.util.List;

public interface UserService {
    
    UserDto getCurrentUser();
    
    Long getUserIdByUsername(String username);
    
    List<UserDto> getAllUsers();
    
    List<UserDto> getAllUsersByRole(User.Role role);
    
    UserDto getUserById(Long id);
    
    UserDto updateUser(Long id, UserDto userDto);
    
    void deleteUser(Long id);
    
    List<UserDto> getPublicTrainers();
    
    List<UserDto> getPublicNutritionists();
    Long getUserIdByUsernameOrEmail(String username);
}