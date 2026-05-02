package com.core.inventoryservice.exception;

public class SkuAlreadyExistException extends RuntimeException {
    public SkuAlreadyExistException(String message) {
        super(message);
    }
}
