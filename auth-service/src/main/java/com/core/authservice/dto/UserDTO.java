package com.core.authservice.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record UserDTO(
        UUID id,
        String email,
        String name,
        String role
) {
}
