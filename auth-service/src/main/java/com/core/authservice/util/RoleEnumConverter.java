package com.core.authservice.util;

import com.core.authservice.domain.UserRole;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class RoleEnumConverter implements AttributeConverter<List<UserRole>, String> {

    @Override
    public String convertToDatabaseColumn(List<UserRole> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "";
        }
        return attribute.stream()
                .map(Enum::name)
                .collect(Collectors.joining(","));
    }

    @Override
    public List<UserRole> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(dbData.split(","))
                .map(UserRole::valueOf)
                .collect(Collectors.toList());
    }
}
