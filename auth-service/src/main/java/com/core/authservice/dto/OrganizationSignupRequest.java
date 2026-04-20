package com.core.authservice.dto;

import com.core.authservice.util.UniqueEmailAddress;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public record OrganizationSignupRequest(

        @NotBlank(message = "Organization name is required")
        @Length(max = 50, message = "Organization name is too long")
        String organizationName,

        @NotBlank(message = "Email address is required")
        @UniqueEmailAddress
        @Email
        String email,

        @NotBlank(message = "Admin name is required")
        @Length(max = 50, message = "Name is too long")
        String adminName,

        @NotBlank(message = "Password is required")
        @Length(min = 8, max = 30, message = "Password must be between 8 and 30 characters")
        String password
) {
}
