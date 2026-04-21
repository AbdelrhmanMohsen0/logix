package com.core.authservice.dto;

import com.core.authservice.domain.UserRole;
import com.core.authservice.util.UniqueEmailAddress;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserCreationRequest(

    @NotBlank(message = "User name is required")
    @Length(max = 50, message = "Name is too long")
    String name,

    @NotBlank(message = "Email address is required")
    @UniqueEmailAddress
    @Email
    String email,

    @NotBlank(message = "Password is required")
    @Length(min = 8, max = 30, message = "Password must be between 8 and 30 characters")
    String password,

    @NotNull(message = "Role is required")
    UserRole role
) {
}
