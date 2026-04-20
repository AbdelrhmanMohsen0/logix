package com.core.authservice.service;

import com.core.authservice.domain.Organization;
import com.core.authservice.domain.User;
import com.core.authservice.domain.UserRole;
import com.core.authservice.dto.OrganizationSignupRequest;
import com.core.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void createOrganizationOwner(OrganizationSignupRequest organizationSignupRequest, Organization organization) {
        userRepository.save(User.builder()
                .organizationId(organization.getId())
                .email(organizationSignupRequest.email())
                .password(passwordEncoder.encode(organizationSignupRequest.password()))
                .name(organizationSignupRequest.adminName())
                .roles(List.of(UserRole.values()))
                .build());
    }
}
