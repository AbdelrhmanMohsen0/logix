package com.core.orderservice.exception;

import java.util.UUID;

public class OrderNotFoundException extends RuntimeException {
	
	public OrderNotFoundException(UUID id) {
		super("Notification not found with id: " + id);
	}
}
