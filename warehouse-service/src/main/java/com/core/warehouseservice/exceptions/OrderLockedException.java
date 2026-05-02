package com.core.warehouseservice.exceptions;

public class OrderLockedException extends RuntimeException {
    public OrderLockedException(String message) {
        super(message);
    }
}
