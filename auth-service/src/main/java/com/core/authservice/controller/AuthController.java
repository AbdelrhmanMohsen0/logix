package com.core.authservice.controller;

import com.core.authservice.domain.Organization;
import com.core.authservice.dto.AuthResponse;
import com.core.authservice.dto.LoginRequest;
import com.core.authservice.dto.OrganizationSignupRequest;
import com.core.authservice.security.SecurityUser;
import com.core.authservice.service.AuthService;
import com.core.authservice.service.OrganizationService;
import com.core.authservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final OrganizationService organizationService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        SecurityUser securityUser = authService.authenticate(
                loginRequest.email(),
                loginRequest.password()
        );
        String tokenValue = authService.generateToken(securityUser);
        return ResponseEntity.ok(new AuthResponse(tokenValue));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupNewOrganization(@Valid @RequestBody OrganizationSignupRequest organizationSignupRequest) {
        Organization organization = organizationService.createNewOrganization(organizationSignupRequest.organizationName());
        userService.createOrganizationOwner(organizationSignupRequest, organization);
        return login(new LoginRequest(organizationSignupRequest.email(), organizationSignupRequest.password()));
    }

}
