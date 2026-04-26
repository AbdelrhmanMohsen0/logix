package com.core.inventoryservice.dto;

public record ProductDTO(
		String name,
		String sku,
		Integer quantity,
		Double price,
		Integer threshold
) {}
