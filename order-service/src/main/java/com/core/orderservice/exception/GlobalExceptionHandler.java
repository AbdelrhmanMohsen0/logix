package com.core.orderservice.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(OrderNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleOrderNotFoundException(OrderNotFoundException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", HttpStatus.NOT_FOUND.value());
		body.put("message", ex.getMessage());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
	}


}
