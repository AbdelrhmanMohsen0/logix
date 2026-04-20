package com.core.authservice.util;

import com.core.authservice.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UniqueEmailAddressValidator implements ConstraintValidator<UniqueEmailAddress, String> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.isEmpty()) return true;
        return !userRepository.existsByEmail(email);
    }
}
