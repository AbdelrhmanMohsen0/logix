package com.core.authservice.controller;

import com.core.authservice.domain.User;
import com.core.authservice.dto.UserCreationRequest;
import com.core.authservice.dto.UserDTO;
import com.core.authservice.dto.UserUpdateRequest;
import com.core.authservice.mapper.UserMapper;
import com.core.authservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> addUser(@Valid @RequestBody UserCreationRequest userCreationRequest,
                                           JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        User newUser = userService.addUser(userCreationRequest, orgId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newUser.getId())
                .toUri();

        return ResponseEntity.created(location).body(userMapper.toUserDTO(newUser));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers(JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        List<User> users = userService.getAllUsers(orgId);
        return ResponseEntity.ok(users.stream().map(userMapper::toUserDTO).toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id,  JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        return ResponseEntity.ok(userMapper.toUserDTO(userService.getUserById(id, orgId)));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(JwtAuthenticationToken auth) {
        UUID userId = UUID.fromString(auth.getToken().getSubject());
        return ResponseEntity.ok(userMapper.toUserDTO(userService.getUserById(userId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id,
                                              @Valid @RequestBody UserUpdateRequest userUpdateRequest,
                                              JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        User updatedUser = userService.updateUser(id, userUpdateRequest, orgId, auth.getAuthorities());
        return ResponseEntity.ok(userMapper.toUserDTO(updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        userService.deleteUser(id, orgId);
        return ResponseEntity.noContent().build();
    }
}
