package com.core.authservice.mapper;

import com.core.authservice.domain.User;
import com.core.authservice.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(extractPrimaryRole(user))
                .build();
    }

    private String extractPrimaryRole(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            return "UNASSIGNED";
        }

        String roleName = user.getRoles().getFirst().name();

        if (roleName.startsWith("ROLE_")) {
            return roleName.substring(5);
        }

        return roleName;
    }
}