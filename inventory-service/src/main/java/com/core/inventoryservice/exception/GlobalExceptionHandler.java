package com.core.inventoryservice.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(ProductNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleProductNotFoundException(ProductNotFoundException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", HttpStatus.NOT_FOUND.value());
		body.put("message", ex.getMessage());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
	}
	
	@ExceptionHandler(InvalidOrgIdException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidOrdIdException(InvalidOrgIdException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", HttpStatus.NOT_FOUND.value());
		body.put("message", ex.getMessage());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
		String errorMessage = ex.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", HttpStatus.BAD_REQUEST.value());
		body.put("message", errorMessage);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}

	@ExceptionHandler(SkuAlreadyExistException.class)
	public ResponseEntity<Map<String, Object>> handleSkuAlreadyExistException(SkuAlreadyExistException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", HttpStatus.CONFLICT.value());
		body.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
	}
	
}
