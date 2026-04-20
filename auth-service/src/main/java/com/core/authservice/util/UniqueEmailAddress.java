package com.core.authservice.util;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailAddressValidator.class)
public @interface UniqueEmailAddress {
    String message() default "Email address is already used";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
