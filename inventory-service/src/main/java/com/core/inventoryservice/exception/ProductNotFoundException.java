package com.core.inventoryservice.exception;

public class ProductNotFoundException extends RuntimeException {
	
	public ProductNotFoundException(String SKU) {
		super("Product not found with SKU: " + SKU);
	}
}
