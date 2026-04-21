package com.core.authservice.service;

import com.core.authservice.domain.Organization;
import com.core.authservice.domain.User;
import com.core.authservice.domain.UserRole;
import com.core.authservice.dto.UserCreationRequest;
import com.core.authservice.dto.OrganizationSignupRequest;
import com.core.authservice.dto.UserUpdateRequest;
import com.core.authservice.exception.UserNotFoundException;
import com.core.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrganizationService organizationService;

    public void createOrganizationOwner(OrganizationSignupRequest organizationSignupRequest, Organization organization) {
        userRepository.save(User.builder()
                .organization(organization)
                .email(organizationSignupRequest.email())
                .password(passwordEncoder.encode(organizationSignupRequest.password()))
                .name(organizationSignupRequest.adminName())
                .roles(List.of(UserRole.values()))
                .build());
    }

    public User addUser(UserCreationRequest userCreationRequest, UUID orgId, Collection<? extends GrantedAuthority> authorities) {
        validateOwnerCreationPrivileges(authorities, userCreationRequest.role());

        User user = User.builder()
                .organization(organizationService.getReferenceById(orgId))
                .email(userCreationRequest.email())
                .password(passwordEncoder.encode(userCreationRequest.password()))
                .name(userCreationRequest.name())
                .roles(getUserRoles(userCreationRequest.role()))
                .build();

        return userRepository.save(user);
    }

    public List<User> getAllUsers(UUID orgId) {
        return userRepository.findAllByOrganizationId(orgId);
    }

    public User getUserById(UUID id, UUID orgId) {
        return userRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public User updateUser(UUID id,
                           UserUpdateRequest userUpdateRequest,
                           UUID orgId,
                           Collection<? extends GrantedAuthority> authorities) {

        User user = userRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        if (user.getRoles().contains(UserRole.ROLE_OWNER) && !roles.contains(UserRole.ROLE_OWNER.name())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only Owners can update Owner accounts.");
        }

        if (userUpdateRequest.role().equals(UserRole.ROLE_OWNER) && !roles.contains(UserRole.ROLE_OWNER.name())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only Owners can set account roles to OWNER.");
        }

        if (userRepository.existsByEmailAndIdNot(userUpdateRequest.email(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        user.setName(userUpdateRequest.name());
        user.setEmail(userUpdateRequest.email());
        user.setPassword(passwordEncoder.encode(userUpdateRequest.password()));
        user.setRoles(getUserRoles(userUpdateRequest.role()));

        return userRepository.save(user);
    }

    public void deleteUser(UUID id, UUID orgId) {
        User user = userRepository.findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        if (user.getRoles().contains(UserRole.ROLE_OWNER)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Owner accounts can't be deleted.");
        }
        userRepository.delete(user);
    }

    private List<UserRole> getUserRoles(UserRole role) {
        List<UserRole> allRoles = Arrays.stream(UserRole.values()).toList();
        return allRoles.subList(role.ordinal(), allRoles.size());
    }

    private void validateOwnerCreationPrivileges(Collection<? extends GrantedAuthority> authorities, UserRole requestedRole) {
        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        boolean isOwner = roles.contains(UserRole.ROLE_OWNER.name());

        boolean creatingOwner = UserRole.ROLE_OWNER.equals(requestedRole);

        if (creatingOwner && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admins cannot create Owner accounts.");
        }
    }
}
