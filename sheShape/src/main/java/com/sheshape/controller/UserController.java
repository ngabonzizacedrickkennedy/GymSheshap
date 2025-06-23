package com.sheshape.controller;

//import com.sheshape.dto.AuthDTO;
import com.sheshape.dto.UserDto;
import com.sheshape.service.AuthService;
import com.sheshape.service.UserService;
import jakarta.validation.Valid;
//import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
//    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
//        this.authService = authService;
    }

//    @PostMapping("/auth/register")
//    public ResponseEntity<UserDto> register(@Valid @RequestBody AuthDTO.RegistrationRequest request) {
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(authService.register(request));
//    }

//    @PostMapping("/auth/login")
//    public ResponseEntity<AuthDTO.AuthResponse> login(@Valid @RequestBody AuthDTO.AuthRequest request) {
//        return ResponseEntity.ok(authService.login(request));
//    }

//    @GetMapping("/auth/me")
//    public ResponseEntity<UserDto> getCurrentUser() {
//        return ResponseEntity.ok(userService.getCurrentUser());
//    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/trainers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllTrainers() {
        return ResponseEntity.ok(userService.getAllUsersByRole(com.sheshape.model.User.Role.TRAINER));
    }

    @GetMapping("/admin/nutritionists")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllNutritionists() {
        return ResponseEntity.ok(userService.getAllUsersByRole(com.sheshape.model.User.Role.NUTRITIONIST));
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<UserDto>> getPublicTrainers() {
        return ResponseEntity.ok(userService.getPublicTrainers());
    }

    @GetMapping("/nutritionists")
    public ResponseEntity<List<UserDto>> getPublicNutritionists() {
        return ResponseEntity.ok(userService.getPublicNutritionists());
    }
}