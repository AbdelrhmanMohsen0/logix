package com.core.inventoryservice.exception;

import java.util.UUID;

public class InvalidOrgIdException extends RuntimeException {
	
	public InvalidOrgIdException(UUID OrgId) {
		super("Invalid organization ID: " + OrgId);
	}
}
