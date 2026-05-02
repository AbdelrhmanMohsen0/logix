package com.core.warehouseservice.controller;

import com.core.warehouseservice.dto.ErrorResponse;
import com.core.warehouseservice.exceptions.OrderLockedException;
import com.core.warehouseservice.exceptions.OrderNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class ErrorController {

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleOrderNotFoundException(OrderNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OrderLockedException.class)
    public ResponseEntity<ErrorResponse> handleOrderLockedException(OrderLockedException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.LOCKED.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(error, HttpStatus.LOCKED);
    }
}
